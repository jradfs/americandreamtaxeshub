import { ImageAnnotatorClient } from "@google-cloud/vision";
import { createChatCompletion } from "./openai-client";

// Initialize Google Cloud Vision client
const visionClient = new ImageAnnotatorClient();

export interface DocumentTemplate {
  type: string;
  expectedFields: {
    [key: string]: {
      type: "string" | "number" | "date";
      required: boolean;
      validation?: RegExp;
    };
  };
}

export interface ExtractedData {
  fields: { [key: string]: string };
  confidence: number;
  raw: string;
}

export interface ProcessingResult {
  success: boolean;
  data?: ExtractedData;
  error?: string;
}

const documentTemplates: { [key: string]: DocumentTemplate } = {
  w2: {
    type: "tax_form",
    expectedFields: {
      employerEIN: {
        type: "string",
        required: true,
        validation: /^\d{2}-\d{7}$/,
      },
      wages: {
        type: "number",
        required: true,
      },
      federalTax: {
        type: "number",
        required: true,
      },
    },
  },
  "1099": {
    type: "tax_form",
    expectedFields: {
      payerTIN: {
        type: "string",
        required: true,
        validation: /^\d{2}-\d{7}$/,
      },
      nonemployeeCompensation: {
        type: "number",
        required: true,
      },
    },
  },
};

async function performOCR(imageBuffer: Buffer): Promise<string> {
  try {
    const [result] = await visionClient.textDetection(imageBuffer);
    return result.fullTextAnnotation?.text || "";
  } catch (error) {
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

async function extractDataWithAI(
  text: string,
  documentType: string,
): Promise<ExtractedData> {
  const template = documentTemplates[documentType];
  if (!template) {
    throw new Error(`Unknown document type: ${documentType}`);
  }

  const prompt = `Extract the following fields from this tax document: ${Object.keys(template.expectedFields).join(", ")}. Document text: ${text}`;

  try {
    const response = await createChatCompletion([
      {
        role: "system",
        content: "You are a tax document processing assistant.",
      },
      { role: "user", content: prompt },
    ]);

    const extractedData = JSON.parse(response || "{}");
    return {
      fields: extractedData,
      confidence: 0.8, // This could be calculated based on AI confidence scores
      raw: text,
    };
  } catch (error) {
    throw new Error(`AI extraction failed: ${error.message}`);
  }
}

function validateExtractedData(
  data: ExtractedData,
  documentType: string,
): boolean {
  const template = documentTemplates[documentType];
  if (!template) return false;

  for (const [field, config] of Object.entries(template.expectedFields)) {
    const value = data.fields[field];

    if (config.required && !value) {
      return false;
    }

    if (value && config.validation && !config.validation.test(value)) {
      return false;
    }

    if (value && config.type === "number" && isNaN(Number(value))) {
      return false;
    }
  }

  return true;
}

export async function processDocument(
  documentBuffer: Buffer,
  documentType: string,
): Promise<ProcessingResult> {
  try {
    // Step 1: Perform OCR
    const extractedText = await performOCR(documentBuffer);
    if (!extractedText) {
      return {
        success: false,
        error: "No text could be extracted from the document",
      };
    }

    // Step 2: Extract structured data using AI
    const extractedData = await extractDataWithAI(extractedText, documentType);

    // Step 3: Validate the extracted data
    const isValid = validateExtractedData(extractedData, documentType);
    if (!isValid) {
      return { success: false, error: "Extracted data validation failed" };
    }

    return {
      success: true,
      data: extractedData,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export function getSupportedDocumentTypes(): string[] {
  return Object.keys(documentTemplates);
}

export function getDocumentTemplate(
  documentType: string,
): DocumentTemplate | null {
  return documentTemplates[documentType] || null;
}
