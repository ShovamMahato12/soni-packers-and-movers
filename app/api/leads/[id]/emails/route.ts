import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

import { getSession } from "@/lib/auth";
import { jsonError, jsonSuccess, unauthorized } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { sendCustomEmail } from "@/lib/mail";

// Sync emails from IMAP inbox for a specific customer email
async function syncImapEmails(bookingId: string, leadEmail: string) {
  const host = "imap.gmail.com";
  const port = 993;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.error("IMAP sync skipped: SMTP_USER or SMTP_PASS not set");
    return;
  }

  // Pure JS client for IMAP
  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();

    const lock = await client.getMailboxLock("INBOX");
    try {
      // Search for messages FROM the lead's email
      const messages = await client.search({ from: leadEmail });

      if (messages && Array.isArray(messages)) {
        for (const seq of messages) {
          // Fetch envelope and full source
          const message = await client.fetchOne(seq, { envelope: true, source: true });
          if (!message || !message.envelope || !message.source) continue;

          const messageId = message.envelope.messageId;
          if (!messageId) continue;

          // Prevent duplicate entries
          const existing = await prisma.leadEmail.findUnique({
            where: { messageId },
          });

          if (!existing) {
            const parsed = await simpleParser(message.source);
            // Prefer plain text, fall back to HTML or empty string
            const body = parsed.text || parsed.html || "";
            const subject = parsed.subject || "Re: Shifting Inquiry";
            const date = parsed.date || new Date();

            await prisma.leadEmail.create({
              data: {
                bookingId,
                direction: "RECEIVED",
                subject,
                body,
                from: leadEmail,
                to: user,
                messageId,
                createdAt: date,
              },
            });
          }
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (error) {
    console.error("IMAP Sync error:", error);
    // Gracefully ignore IMAP errors so user still gets existing database records
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await context.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return jsonError("Lead not found", 404);
    }

    // Attempt to sync incoming email replies from Gmail IMAP inbox
    await syncImapEmails(id, booking.email);

    // Retrieve full conversation history from DB
    const emails = await prisma.leadEmail.findMany({
      where: { bookingId: id },
      orderBy: { createdAt: "asc" },
    });

    return jsonSuccess({
      emails: emails.map((email) => ({
        ...email,
        createdAt: email.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET Emails failed:", error);
    return jsonError("Failed to load email correspondence", 500);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await context.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return jsonError("Lead not found", 404);
    }

    const { subject, body } = await request.json();

    if (!subject?.trim() || !body?.trim()) {
      return jsonError("Subject and Message body are required", 400);
    }

    const user = process.env.SMTP_USER;
    if (!user) {
      return jsonError("SMTP Configuration missing on server", 500);
    }

    // Send email using SMTP nodemailer utility
    await sendCustomEmail({
      to: booking.email,
      subject: subject.trim(),
      body: body.trim(),
    });

    // Record the sent email in the database
    const sentEmail = await prisma.leadEmail.create({
      data: {
        bookingId: id,
        direction: "SENT",
        subject: subject.trim(),
        body: body.trim(),
        from: user,
        to: booking.email,
        createdAt: new Date(),
      },
    });

    return jsonSuccess({
      email: {
        ...sentEmail,
        createdAt: sentEmail.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST Email failed:", error);
    return jsonError("Failed to send email", 500);
  }
}
