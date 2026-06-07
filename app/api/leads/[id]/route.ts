import { z } from "zod";

import { getSession } from "@/lib/auth";
import { isLeadStatus } from "@/lib/constants";
import { jsonError, jsonSuccess, unauthorized } from "@/lib/api-utils";
import { parseKolkataDateTimeLocalValue } from "@/lib/lead-crm";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.string().min(1),
  nextFollowUpAt: z.string().trim().nullable().optional(),
  adminNote: z.string().trim().nullable().optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await context.params;
  const lead = await prisma.booking.findUnique({ where: { id } });

  if (!lead) {
    return jsonError("Lead not found", 404);
  }

  return jsonSuccess({
    lead: {
      ...lead,
      moveDate: lead.moveDate.toISOString(),
      createdAt: lead.createdAt.toISOString(),
      nextFollowUpAt: lead.nextFollowUpAt?.toISOString() ?? null,
      adminNote: lead.adminNote,
      statusUpdatedAt: lead.statusUpdatedAt?.toISOString() ?? null,
    },
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success || !isLeadStatus(parsed.data.status)) {
      return jsonError("Invalid status", 400);
    }

    const normalizedNote = parsed.data.adminNote?.trim() ?? "";
    const nextFollowUpAt = parsed.data.nextFollowUpAt?.trim() ?? "";
    const parsedFollowUpAt = nextFollowUpAt ? parseKolkataDateTimeLocalValue(nextFollowUpAt) : null;

    if (parsed.data.status === "Follow-up" && !parsedFollowUpAt) {
      return jsonError("Next follow-up date and time are required for Follow-up status", 400);
    }

    const followUpAt = parsedFollowUpAt;

    if (parsed.data.status === "Follow-up" && followUpAt && followUpAt.getTime() <= Date.now()) {
      return jsonError("Follow-up must be a future date and time", 400);
    }

    const lead = await prisma.booking.update({
      where: { id },
      data: {
        status: parsed.data.status,
        nextFollowUpAt: followUpAt,
        adminNote: normalizedNote || null,
        statusUpdatedAt: new Date(),
        reminderSent: false,
      },
    });

    return jsonSuccess({
      lead: {
        ...lead,
        moveDate: lead.moveDate.toISOString(),
        createdAt: lead.createdAt.toISOString(),
        nextFollowUpAt: lead.nextFollowUpAt?.toISOString() ?? null,
        adminNote: lead.adminNote,
        statusUpdatedAt: lead.statusUpdatedAt?.toISOString() ?? null,
      },
    });
  } catch {
    return jsonError("Failed to update lead", 500);
  }
}
