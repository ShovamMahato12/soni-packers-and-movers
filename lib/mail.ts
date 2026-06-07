import nodemailer from "nodemailer";

export type QuoteMailPayload = {
  name: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveDate: Date;
  moveType: string;
  message: string;
};

/** Matches Tailwind `bg-gradient-to-r from-orange-600 to-orange-500` for email clients */
const GRADIENT_ORANGE = "linear-gradient(to right, #ea580c, #f97316)";
const BRAND = "Sony Packers and Movers";
const COPYRIGHT = `© 2026 ${BRAND}. All rights reserved.`;
const CONTACT_EMAIL = "info@sonypackers.com";
const PHONE_A = "6209280901";
const PHONE_B = "9835983331";

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoveDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/** Human-readable move type for copy (e.g. Household Shifting) */
function moveTypeLabel(moveType: string): string {
  const key = moveType.toLowerCase().trim();
  const map: Record<string, string> = {
    household: "Household Shifting",
    office: "Office Relocation",
    domestic: "Domestic Shifting",
    loading: "Loading Services",
    storage: "Storage Services",
    vehicle: "Vehicle Transportation",
  };
  if (map[key]) return map[key];
  const pretty = moveType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return pretty.includes("Shifting") || pretty.includes("Relocation") ? pretty : `${pretty} Services`;
}

function formatMoveTypeHtml(moveType: string): string {
  return escapeHtml(moveTypeLabel(moveType));
}

function getMailFrom(): string {
  const user = process.env.SMTP_USER;
  if (!user) throw new Error("SMTP_USER is not set");
  return `"${BRAND}" <${user}>`;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !portRaw || !user || !pass) {
    throw new Error("SMTP configuration is incomplete (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).");
  }

  const port = Number(portRaw);
  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a number.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/** Header: orange gradient, white check badge, title + subtitle */
function emailHeaderBlock(title: string, subtitle: string): string {
  const t = escapeHtml(title);
  const s = escapeHtml(subtitle);
  return `
          <tr>
            <td style="background:${GRADIENT_ORANGE};padding:28px 24px 32px;border-radius:12px 12px 0 0;text-align:center;">
              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 16px;">
                <tr>
                  <td style="width:56px;height:56px;border-radius:50%;background:#ffffff;text-align:center;vertical-align:middle;line-height:56px;">
                    <span style="font-size:26px;color:#16a34a;font-weight:700;line-height:56px;display:inline-block;" aria-hidden="true">&#10003;</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:0;font-size:26px;color:#ffffff;font-weight:700;letter-spacing:-0.02em;line-height:1.2;">${t}</h1>
              <p style="margin:12px 0 0;font-size:15px;color:rgba(255,255,255,0.95);line-height:1.5;max-width:480px;margin-left:auto;margin-right:auto;">${s}</p>
            </td>
          </tr>`;
}

/** Footer: orange gradient, copyright + contact email */
function emailFooterBlock(): string {
  const copy = escapeHtml(COPYRIGHT);
  const mail = escapeHtml(CONTACT_EMAIL);
  return `
          <tr>
            <td style="background:${GRADIENT_ORANGE};padding:22px 24px;border-radius:0 0 12px 12px;text-align:center;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.95);line-height:1.5;">${copy}</p>
              <p style="margin:10px 0 0;font-size:13px;">
                <a href="mailto:${encodeURIComponent(CONTACT_EMAIL)}" style="color:#ffffff;text-decoration:underline;font-weight:600;">${mail}</a>
              </p>
            </td>
          </tr>`;
}

const VALUE_PROPS_HTML = `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 0;">
                <tr><td style="padding:8px 0;font-size:14px;color:#334155;line-height:1.55;">&#128666; Expert packers &amp; movers with trusted experience in Ranchi &amp; beyond.</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#334155;line-height:1.55;">&#128176; Transparent pricing — no hidden charges.</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#334155;line-height:1.55;">&#128737; Careful packing &amp; safe handling for your belongings.</td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#334155;line-height:1.55;">&#9201; On-time pickup &amp; delivery — we respect your schedule.</td></tr>
              </table>`;

function contactCalloutHtml(): string {
  return `
              <p style="margin:24px 0 0;font-size:14px;color:#334155;line-height:1.65;">
                Need to speak with us right away? Call us at
                <strong style="color:#0f172a;">+91 ${escapeHtml(PHONE_A)}</strong> or
                <strong style="color:#0f172a;">+91 ${escapeHtml(PHONE_B)}</strong> — we are available
                <strong style="color:#0f172a;">24 × 7</strong>.
              </p>`;
}

function emailShell(innerBody: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>${escapeHtml(BRAND)}</title></head>
<body style="margin:0;padding:0;background-color:#e2e8f0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e2e8f0;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.12);">
${innerBody}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminQuoteHtml(data: QuoteMailPayload): string {
  const n = escapeHtml(data.name);
  const e = escapeHtml(data.email);
  const p = escapeHtml(data.phone);
  const from = escapeHtml(data.movingFrom);
  const to = escapeHtml(data.movingTo);
  const msg = escapeHtml(data.message).replaceAll("\n", "<br/>");
  const when = escapeHtml(formatMoveDate(data.moveDate));
  const type = formatMoveTypeHtml(data.moveType);

  const body = `
${emailHeaderBlock("New quote request!", "A customer submitted the website form — details are below for your team.")}
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.65;">
                Please follow up from <strong style="color:#0f172a;">${BRAND}</strong> at your earliest convenience.
              </p>
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#ea580c;">CUSTOMER ENQUIRY DETAILS</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;border-radius:10px;border:1px solid #e2e8f0;">
                <tr><td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#334155;">
                    <tr><td style="padding:6px 0;width:38%;color:#64748b;font-weight:600;">Name</td><td style="padding:6px 0;color:#0f172a;">${n}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;">Email</td><td style="padding:6px 0;"><a href="mailto:${encodeURIComponent(data.email)}" style="color:#ea580c;font-weight:600;text-decoration:none;">${e}</a></td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;">Phone</td><td style="padding:6px 0;"><a href="tel:${escapeHtml(data.phone.replace(/\D/g, ""))}" style="color:#ea580c;font-weight:600;text-decoration:none;">${p}</a></td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;">Service</td><td style="padding:6px 0;color:#0f172a;">${type}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;vertical-align:top;">Moving from</td><td style="padding:6px 0;color:#0f172a;">${from}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;vertical-align:top;">Moving to</td><td style="padding:6px 0;color:#0f172a;">${to}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;">Move date</td><td style="padding:6px 0;color:#0f172a;">${when}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;vertical-align:top;">Message</td><td style="padding:6px 0;color:#0f172a;line-height:1.55;">${msg}</td></tr>
                  </table>
                </td></tr>
              </table>
              ${VALUE_PROPS_HTML}
              ${contactCalloutHtml()}
            </td>
          </tr>
${emailFooterBlock()}`;

  return emailShell(body);
}

function adminQuoteText(data: QuoteMailPayload): string {
  return [
    "New Quote Request Received",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Service: ${moveTypeLabel(data.moveType)}`,
    `Moving from: ${data.movingFrom}`,
    `Moving to: ${data.movingTo}`,
    `Move date: ${formatMoveDate(data.moveDate)}`,
    "",
    "Message:",
    data.message,
    "",
    `Call: +91 ${PHONE_A} | +91 ${PHONE_B} | ${CONTACT_EMAIL}`,
    "",
    COPYRIGHT,
  ].join("\n");
}

function customerQuoteHtml(data: QuoteMailPayload): string {
  const first = escapeHtml(data.name.split(/\s+/)[0] || data.name);
  const n = escapeHtml(data.name);
  const from = escapeHtml(data.movingFrom);
  const to = escapeHtml(data.movingTo);
  const when = escapeHtml(formatMoveDate(data.moveDate));
  const type = formatMoveTypeHtml(data.moveType);
  const msg = escapeHtml(data.message).replaceAll("\n", "<br/>");
  const e = escapeHtml(data.email);
  const p = escapeHtml(data.phone);

  const body = `
${emailHeaderBlock("Request received!", "We have got your enquiry and will reach out shortly.")}
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0 0 16px;font-size:16px;color:#0f172a;line-height:1.6;">Dear <strong>${first}</strong>,</p>
              <p style="margin:0 0 22px;font-size:15px;color:#334155;line-height:1.65;">
                Thank you for reaching out to <strong style="color:#0f172a;">${escapeHtml(BRAND)}</strong>! We have received your request for
                <strong style="color:#0f172a;">${formatMoveTypeHtml(data.moveType)}</strong> and our team will contact you within
                <strong style="color:#0f172a;">30 minutes</strong> with a transparent, no-obligation quote.
              </p>
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#ea580c;">YOUR ENQUIRY DETAILS</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;border-radius:10px;border:1px solid #e2e8f0;">
                <tr><td style="padding:14px 18px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#334155;">
                    <tr><td style="padding:6px 0;width:38%;color:#64748b;font-weight:600;">Service</td><td style="padding:6px 0;color:#0f172a;">${type}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;">Phone</td><td style="padding:6px 0;"><a href="tel:${escapeHtml(data.phone.replace(/\D/g, ""))}" style="color:#ea580c;font-weight:600;text-decoration:none;">${p}</a></td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;">Email</td><td style="padding:6px 0;"><a href="mailto:${encodeURIComponent(data.email)}" style="color:#ea580c;font-weight:600;text-decoration:none;">${e}</a></td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;vertical-align:top;">Moving from</td><td style="padding:6px 0;color:#0f172a;">${from}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;vertical-align:top;">Moving to</td><td style="padding:6px 0;color:#0f172a;">${to}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;">Move date</td><td style="padding:6px 0;color:#0f172a;">${when}</td></tr>
                    <tr><td style="padding:6px 0;color:#64748b;font-weight:600;vertical-align:top;">Message</td><td style="padding:6px 0;color:#0f172a;line-height:1.55;">${msg}</td></tr>
                  </table>
                </td></tr>
              </table>
              ${VALUE_PROPS_HTML}
              ${contactCalloutHtml()}
              <p style="margin:20px 0 0;font-size:14px;color:#0f172a;line-height:1.6;">Warm regards,<br/><strong>${escapeHtml(BRAND)}</strong></p>
            </td>
          </tr>
${emailFooterBlock()}`;

  return emailShell(body);
}

function customerQuoteText(data: QuoteMailPayload): string {
  const first = data.name.split(/\s+/)[0] || data.name;
  return [
    "Request received!",
    "",
    `Dear ${first},`,
    "",
    `Thank you for reaching out to ${BRAND}! We have received your request for ${moveTypeLabel(data.moveType)} and our team will contact you within 30 minutes with a transparent, no-obligation quote.`,
    "",
    "YOUR ENQUIRY DETAILS",
    `  Service: ${moveTypeLabel(data.moveType)}`,
    `  Phone: ${data.phone}`,
    `  Email: ${data.email}`,
    `  Moving from: ${data.movingFrom}`,
    `  Moving to: ${data.movingTo}`,
    `  Move date: ${formatMoveDate(data.moveDate)}`,
    `  Message: ${data.message}`,
    "",
    "Expert packers & movers • Transparent pricing • Safe handling • On-time delivery",
    "",
    `Need to speak with us? +91 ${PHONE_A} | +91 ${PHONE_B} (24x7) | ${CONTACT_EMAIL}`,
    "",
    COPYRIGHT,
  ].join("\n");
}

export async function sendAdminQuoteNotification(data: QuoteMailPayload): Promise<void> {
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) {
    throw new Error("ADMIN_EMAIL is not set.");
  }

  const transporter = createTransporter();
  const from = getMailFrom();

  await transporter.sendMail({
    from,
    to: admin,
    replyTo: data.email,
    subject: "New Quote Request Received",
    text: adminQuoteText(data),
    html: adminQuoteHtml(data),
  });
}

export async function sendCustomerQuoteConfirmation(data: QuoteMailPayload): Promise<void> {
  const transporter = createTransporter();
  const from = getMailFrom();

  await transporter.sendMail({
    from,
    to: data.email,
    subject: "Quote Request Received Successfully",
    text: customerQuoteText(data),
    html: customerQuoteHtml(data),
  });
}

export async function sendQuoteBookingEmails(data: QuoteMailPayload): Promise<void> {
  await Promise.all([sendAdminQuoteNotification(data), sendCustomerQuoteConfirmation(data)]);
}

export async function sendCustomEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  const transporter = createTransporter();
  const from = getMailFrom();

  await transporter.sendMail({
    from,
    to,
    subject,
    text: body,
    html: body.replace(/\n/g, "<br/>"),
  });
}

