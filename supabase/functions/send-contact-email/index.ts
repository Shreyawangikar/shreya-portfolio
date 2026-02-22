import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ✅ Safe HTML escape (Deno-compatible)
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    // ✅ Required field validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // ✅ Check if RESEND_API_KEY is available
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // ✅ Sanitize inputs
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");

    // ✅ Send email to admin
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "wangikarshreya@gmail.com",
      replyTo: safeEmail,
      subject: `New message from ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937; margin-top: 0;">New Portfolio Message</h2>
            <p><strong style="color: #374151;">Name:</strong> <span>${safeName}</span></p>
            <p><strong style="color: #374151;">Email:</strong> <span>${safeEmail}</span></p>
            <p><strong style="color: #374151;">Message:</strong></p>
            <p style="color: #4b5563; line-height: 1.6;">${safeMessage}</p>
          </div>
        </div>
      `,
    });

    console.log("Admin notification sent:", emailResponse);

    // ✅ Send auto-reply to visitor
    const autoReplyResponse = await resend.emails.send({
      from: "Shreya Wangikar <onboarding@resend.dev>",
      to: safeEmail,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <p style="color: #1f2937; font-size: 16px;">Hi ${safeName},</p>
            <p style="color: #4b5563; line-height: 1.6;">I've received your message and will get back to you as soon as possible. Thanks for reaching out!</p>
            <p style="color: #4b5563; margin-top: 30px; margin-bottom: 0;">— Shreya</p>
          </div>
        </div>
      `,
    });

    console.log("Auto-reply sent:", autoReplyResponse);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Contact form error:", errorMessage);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});