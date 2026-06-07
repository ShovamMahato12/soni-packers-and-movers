import { prisma } from "./prisma";
import { sendCustomEmail } from "./mail";

let isRunning = false;

// Extends globalThis to persist flag across hot-reloads in development
const globalForScheduler = globalThis as unknown as { reminderSchedulerStarted?: boolean };

export function startReminderScheduler() {
  if (globalForScheduler.reminderSchedulerStarted) {
    return;
  }
  globalForScheduler.reminderSchedulerStarted = true;

  console.log("[Scheduler] Follow-up Reminder Scheduler initialized.");

  // Check every 60 seconds (1 minute)
  setInterval(async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      const now = new Date();
      // Target window: nextFollowUpAt is scheduled within the next 1 hour (down to 15 minutes in the past as safety fallback)
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000 + 5 * 60 * 1000); // add 5 minutes padding to be absolutely sure we capture it

      const bookingsToRemind = await prisma.booking.findMany({
        where: {
          status: "Follow-up",
          reminderSent: false,
          nextFollowUpAt: {
            not: null,
            gte: fifteenMinutesAgo,
            lte: oneHourFromNow,
          },
        },
      });

      for (const booking of bookingsToRemind) {
        if (!booking.nextFollowUpAt) continue;

        const adminEmail = process.env.ADMIN_EMAIL || "mk020615@gmail.com";
        const formattedFollowUpTime = booking.nextFollowUpAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });

        const subject = `[Follow-up Reminder] Client: ${booking.name} at ${formattedFollowUpTime}`;
        const body = `
Dear Admin,

This is an automated reminder that you have a scheduled follow-up with the client detailed below in 1 hour.

Lead Details:
- Name: ${booking.name}
- Phone: ${booking.phone}
- Email: ${booking.email}
- Moving From: ${booking.movingFrom}
- Moving To: ${booking.movingTo}
- Service Type: ${booking.moveType}
- Move Date: ${booking.moveDate.toDateString()}
- Original Message: ${booking.message}

Follow-up Details:
- Scheduled Date & Time: ${formattedFollowUpTime}
- Admin Notes: ${booking.adminNote || "-"}

Please ensure to reach out to the customer at the scheduled time.

Warm regards,
Sony Packers & Movers CRM System
        `.trim();

        console.log(`[Scheduler] Dispatching follow-up reminder email for booking ID ${booking.id} to admin ${adminEmail}`);

        // Send email via nodemailer SMTP helper
        await sendCustomEmail({
          to: adminEmail,
          subject,
          body,
        });

        // Update booking in DB to mark reminder as sent
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            reminderSent: true,
          },
        });
      }
    } catch (error) {
      console.error("[Scheduler] Error running reminder scheduler loop:", error);
    } finally {
      isRunning = false;
    }
  }, 60 * 1000);
}
