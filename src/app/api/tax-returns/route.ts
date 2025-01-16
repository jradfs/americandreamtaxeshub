import { NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-handler";
import { db } from "@/lib/db";
import {
  taxReturnSchema,
  createTaxReturnSchema,
  updateTaxReturnSchema,
  type TaxReturn,
} from "@/lib/validations/taxReturn";

// GET /api/tax-returns
export const GET = createApiHandler({
  requireAuth: true,
  rateLimitKey: "tax-returns-get",
})(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const taxYear = searchParams.get("taxYear");

  let query = db.taxReturn.findMany({
    orderBy: { last_updated: "desc" },
  });

  if (clientId) {
    query = db.taxReturn.findMany({
      where: { client_id: clientId },
      orderBy: { last_updated: "desc" },
    });
  }

  if (taxYear) {
    query = db.taxReturn.findMany({
      where: { tax_year: parseInt(taxYear) },
      orderBy: { last_updated: "desc" },
    });
  }

  const taxReturns = await query;
  return NextResponse.json(taxReturns);
});

// POST /api/tax-returns
export const POST = createApiHandler({
  requireAuth: true,
  rateLimitKey: "tax-returns-post",
})(async (req: Request) => {
  const body = await req.json();

  const validatedData = createTaxReturnSchema.parse(body);

  const newTaxReturn = await db.taxReturn.create({
    data: {
      ...validatedData,
      last_updated: new Date().toISOString(),
      audit_trail: [
        {
          action: "created",
          timestamp: new Date().toISOString(),
          user_id: body.user_id, // Assuming user_id is passed in request
          details: "Tax return created",
        },
      ],
    },
  });

  return NextResponse.json(newTaxReturn, { status: 201 });
});

// PUT /api/tax-returns/:id
export const PUT = createApiHandler({
  requireAuth: true,
  rateLimitKey: "tax-returns-put",
})(async (req: Request) => {
  const id = req.url.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Tax return ID is required" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const validatedData = updateTaxReturnSchema.parse(body);

  const existingTaxReturn = await db.taxReturn.findUnique({
    where: { id },
  });

  if (!existingTaxReturn) {
    return NextResponse.json(
      { error: "Tax return not found" },
      { status: 404 },
    );
  }

  const updatedTaxReturn = await db.taxReturn.update({
    where: { id },
    data: {
      ...validatedData,
      last_updated: new Date().toISOString(),
      audit_trail: [
        ...(existingTaxReturn.audit_trail || []),
        {
          action: "updated",
          timestamp: new Date().toISOString(),
          user_id: body.user_id, // Assuming user_id is passed in request
          details: "Tax return updated",
        },
      ],
    },
  });

  return NextResponse.json(updatedTaxReturn);
});

// DELETE /api/tax-returns/:id
export const DELETE = createApiHandler({
  requireAuth: true,
  requiredRole: "admin", // Only admins can delete tax returns
  rateLimitKey: "tax-returns-delete",
})(async (req: Request) => {
  const id = req.url.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Tax return ID is required" },
      { status: 400 },
    );
  }

  const existingTaxReturn = await db.taxReturn.findUnique({
    where: { id },
  });

  if (!existingTaxReturn) {
    return NextResponse.json(
      { error: "Tax return not found" },
      { status: 404 },
    );
  }

  await db.taxReturn.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
});
