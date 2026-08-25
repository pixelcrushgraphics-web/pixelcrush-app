// Netlify serverless function — emails the customer an order confirmation and
// notifies the studio inbox of a new order. API key stays server-side.
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "Pixel Crush <onboarding@resend.dev>";
// Where new-order alerts go. Separate from the admin dashboard login email on
// purpose — e.g. a shared studio inbox that several people watch.
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL;

function fmtLKR(n) {
  return `LKR ${Number(n || 0).toLocaleString("en-LK")}`;
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { order } = JSON.parse(event.body || "{}");
    if (!order || !order.email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing order" }) };
    }
    if (!process.env.RESEND_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "RESEND_API_KEY is not configured" }) };
    }

    const total = order.negotiable ? "To be confirmed" : fmtLKR(order.total);

    // Customer confirmation
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Order Confirmed — ${order.id}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#000000; color:#ffffff; padding:32px; max-width:520px; margin:0 auto;">
          <h1 style="color:#75FC08; letter-spacing:2px; font-size:22px; margin:0 0 20px;">PIXEL CRUSH</h1>
          <p style="margin:0 0 4px;">Hi ${order.customerName},</p>
          <p style="margin:0 0 20px; opacity:0.8;">Thanks for your order — here's a summary:</p>
          <table style="width:100%; font-size:14px; border-collapse:collapse;">
            <tr><td style="opacity:.6; padding:6px 0;">Order ID</td><td style="text-align:right;">${order.id}</td></tr>
            <tr><td style="opacity:.6; padding:6px 0;">Product</td><td style="text-align:right;">${order.product}</td></tr>
            <tr><td style="opacity:.6; padding:6px 0;">Quantity</td><td style="text-align:right;">${order.qty}</td></tr>
            <tr><td style="opacity:.6; padding:6px 0; border-top:1px dashed #333;">Total</td><td style="text-align:right; color:#75FC08; font-weight:bold; border-top:1px dashed #333;">${total}</td></tr>
          </table>
          <p style="margin:24px 0 0; opacity:0.8;">We'll be in touch shortly to confirm design details and payment.</p>
        </div>
      `,
    });

    // Studio notification
    if (ADMIN_NOTIFY_EMAIL) {
      await resend.emails.send({
        from: FROM,
        to: ADMIN_NOTIFY_EMAIL,
        subject: `New Order — ${order.product} × ${order.qty}`,
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; padding:24px; max-width:520px;">
            <h2 style="margin:0 0 16px;">New Order Received</h2>
            <p><b>Customer:</b> ${order.customerName} (${order.email})</p>
            <p><b>Phone:</b> ${order.phone} &middot; <b>WhatsApp:</b> ${order.whatsapp}</p>
            <p><b>Product:</b> ${order.product} × ${order.qty}</p>
            <p><b>Total:</b> ${total}</p>
            <p><b>Order ID:</b> ${order.id}</p>
          </div>
        `,
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("send-order-email error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send email" }) };
  }
};
