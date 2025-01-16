import type { DocumentCategory } from "@/types/documents";

interface CategoryPattern {
  category: DocumentCategory;
  patterns: RegExp[];
  fileTypes?: string[];
}

const categoryPatterns: CategoryPattern[] = [
  {
    category: "tax_return",
    patterns: [
      /1040/i,
      /tax.?return/i,
      /schedule [a-e]/i,
      /form.?(w-2|1099|941|940)/i,
      /k-1/i,
      /1120s?/i,
      /1065/i,
    ],
    fileTypes: ["application/pdf"],
  },
  {
    category: "financial_statement",
    patterns: [
      /balance.?sheet/i,
      /income.?statement/i,
      /cash.?flow/i,
      /profit.?(and|&).?loss/i,
      /p&l/i,
      /financial.?statement/i,
      /trial.?balance/i,
    ],
    fileTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
  {
    category: "payroll",
    patterns: [
      /payroll/i,
      /form.?941/i,
      /form.?940/i,
      /w-2/i,
      /1099/i,
      /wage.?report/i,
      /time.?sheet/i,
      /pay.?stub/i,
    ],
  },
  {
    category: "corporate",
    patterns: [
      /articles.?of.?incorporation/i,
      /operating.?agreement/i,
      /bylaws/i,
      /board.?resolution/i,
      /meeting.?minutes/i,
      /ein/i,
      /certificate.?of.?(good.?standing|formation)/i,
    ],
  },
];

export async function categorizeDocument(
  fileName: string,
  fileType: string,
): Promise<DocumentCategory> {
  // First, try to match based on file name patterns
  for (const { category, patterns, fileTypes } of categoryPatterns) {
    if (fileTypes && !fileTypes.includes(fileType)) continue;
    if (patterns.some((pattern) => pattern.test(fileName))) {
      return category;
    }
  }

  // If no patterns match, try to categorize based on file type
  if (fileType.includes("pdf")) {
    return "tax_return"; // Most PDFs in tax practice are likely tax returns
  }

  if (fileType.includes("sheet") || fileType.includes("excel")) {
    return "financial_statement";
  }

  // Default category for unrecognized documents
  return "supporting";
}

export function suggestDocumentName(
  originalName: string,
  category: DocumentCategory,
  year?: number,
  metadata?: {
    tax_year?: number;
    form_type?: string;
    business_type?: string;
    quarter?: number;
    month?: number;
  },
): string {
  const cleanName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  const yearStr = year ? `_${year}` : "";
  const formType = metadata?.form_type ? `_${metadata.form_type}` : "";
  const businessType = metadata?.business_type
    ? `_${metadata.business_type}`
    : "";
  const quarter = metadata?.quarter ? `_q${metadata.quarter}` : "";
  const month = metadata?.month
    ? `_m${String(metadata.month).padStart(2, "0")}`
    : "";

  return `${category}/${cleanName}${yearStr}${formType}${businessType}${quarter}${month}`;
}

export function extractYearFromFileName(fileName: string): number | undefined {
  const yearMatch = fileName.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) return parseInt(yearMatch[0]);

  // Try to extract year from common tax form patterns
  const taxYearMatch = fileName.match(/tax.?year.?(\d{4})/i);
  if (taxYearMatch) return parseInt(taxYearMatch[1]);

  // Try to extract year from quarter notation (e.g., Q2 2023)
  const quarterYearMatch = fileName.match(/q[1-4].?(\d{4})/i);
  if (quarterYearMatch) return parseInt(quarterYearMatch[1]);

  return undefined;
}

export function validateDocumentCategory(
  category: DocumentCategory,
  allowedCategories?: DocumentCategory[],
): boolean {
  if (!allowedCategories || allowedCategories.length === 0) {
    return true;
  }
  return allowedCategories.includes(category);
}
