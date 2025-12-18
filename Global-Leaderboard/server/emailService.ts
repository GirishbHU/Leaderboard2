import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@i2u.ai";
const ADMIN_EMAIL = "girish@i2u.ai";

export const isEmailConfigured = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  console.log("Email service initialized");
} else {
  console.log("Email service not configured - alerts will be logged only");
}

export interface PaymentAlertEmailData {
  to: string;
  subject: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: "success" | "failed" | "pending";
  orderId: string;
  planType: string;
  transactionId?: string;
  paymentMethod?: string;
  errorMessage?: string;
}

export async function sendPaymentAlertEmail(data: PaymentAlertEmailData): Promise<boolean> {
  const statusEmoji = data.status === "success" ? "✅" : data.status === "failed" ? "❌" : "⏳";
  const statusText = data.status.toUpperCase();
  
  const emailContent = `
Payment Alert - ${statusText}
================================

Status: ${statusEmoji} ${statusText}
Order ID: ${data.orderId}
${data.transactionId ? `Transaction ID: ${data.transactionId}` : ""}

User Details:
- Email: ${data.userEmail}
- Plan: ${data.planType}

Payment Details:
- Amount: ${data.currency} ${data.amount}
- Method: ${data.paymentMethod || "Gateway"}
${data.errorMessage ? `- Error: ${data.errorMessage}` : ""}

Timestamp: ${new Date().toISOString()}
================================
  `.trim();

  console.log(`[Payment Alert] ${data.subject}`);
  console.log(emailContent);

  if (!isEmailConfigured || !transporter) {
    console.log("[Email] Not configured - alert logged only");
    return false;
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: data.to,
      subject: data.subject,
      text: emailContent,
      html: generateHtmlEmail(data, statusEmoji),
    });
    console.log(`[Email] Sent successfully to ${data.to}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

function generateHtmlEmail(data: PaymentAlertEmailData, statusEmoji: string): string {
  const statusColor = data.status === "success" ? "#22c55e" : data.status === "failed" ? "#ef4444" : "#f59e0b";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${statusColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .label { font-weight: bold; color: #6b7280; }
    .value { color: #111827; }
    .amount { font-size: 24px; font-weight: bold; color: ${statusColor}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${statusEmoji} Payment ${data.status.toUpperCase()}</h1>
      <p class="amount">${data.currency} ${data.amount}</p>
    </div>
    <div class="content">
      <div class="detail-row">
        <span class="label">Order ID:</span>
        <span class="value">${data.orderId}</span>
      </div>
      ${data.transactionId ? `
      <div class="detail-row">
        <span class="label">Transaction ID:</span>
        <span class="value">${data.transactionId}</span>
      </div>
      ` : ""}
      <div class="detail-row">
        <span class="label">User Email:</span>
        <span class="value">${data.userEmail}</span>
      </div>
      <div class="detail-row">
        <span class="label">Plan:</span>
        <span class="value">${data.planType}</span>
      </div>
      <div class="detail-row">
        <span class="label">Payment Method:</span>
        <span class="value">${data.paymentMethod || "Gateway"}</span>
      </div>
      ${data.errorMessage ? `
      <div class="detail-row" style="background: #fef2f2; padding: 10px; border-radius: 4px;">
        <span class="label" style="color: #dc2626;">Error:</span>
        <span class="value" style="color: #dc2626;">${data.errorMessage}</span>
      </div>
      ` : ""}
    </div>
    <div class="footer">
      <p>i2u.ai - Ideas to Unicorns through AI</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendRegistrationAlertEmail(userData: {
  email: string;
  name: string;
  role: string;
  country: string;
  paymentStatus: string;
  amount?: number;
  currency?: string;
}): Promise<boolean> {
  const subject = `[i2u.ai] New Registration - ${userData.name} (${userData.role})`;
  
  const emailContent = `
New User Registration
=====================

Name: ${userData.name}
Email: ${userData.email}
Role: ${userData.role}
Country: ${userData.country}
Payment Status: ${userData.paymentStatus}
${userData.amount ? `Amount: ${userData.currency} ${userData.amount}` : ""}

Timestamp: ${new Date().toISOString()}
=====================
  `.trim();

  console.log(`[Registration Alert] ${subject}`);
  console.log(emailContent);

  if (!isEmailConfigured || !transporter) {
    console.log("[Email] Not configured - alert logged only");
    return false;
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      text: emailContent,
    });
    console.log(`[Email] Registration alert sent to ${ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send registration alert:", error);
    return false;
  }
}
