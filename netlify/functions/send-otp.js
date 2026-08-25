// Netlify serverless function — sends the password-reset OTP by real email.
// The Resend API key lives only here (server-side env var), never in the browser.
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// Until you verify your own domain in Resend, you must send FROM this address.
// Once your domain is verified, switch this to e.g. "Pixel Crush <no-reply@pixelcrush.lk>"
const FROM = process.env.EMAIL_FROM || "Pixel Crush <onboarding@resend.dev>";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { email, code, name } = JSON.parse(event.body || "{}");
    if (!email || !code) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing email or code" }) };
    }
    if (!process.env.RESEND_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "RESEND_API_KEY is not configured" }) };
    }

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your Pixel Crush verification code: ${code}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#000000; color:#ffffff; padding:32px; max-width:480px; margin:0 auto;">
          <h1 style="color:#75FC08; letter-spacing:2px; font-size:22px; margin:0 0 24px;">PIXEL CRUSH</h1>
          <p style="margin:0 0 8px;">Hi${name ? " " + name : ""},</p>
          <p style="margin:0 0 20px; opacity:0.8;">Use this code to reset your password. It expires in 10 minutes.</p>
          <div style="font-size:32px; font-weight:bold; letter-spacing:10px; background:#0a0a0a; color:#75FC08; padding:16px 20px; display:inline-block; border:2px solid #75FC08;">
            ${code}
          </div>
          <p style="margin:24px 0 0; font-size:12px; opacity:0.5;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("send-otp error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send email" }) };
  }
};
