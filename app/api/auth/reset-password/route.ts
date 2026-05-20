import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, redirectTo } = await req.json() as { email?: string; redirectTo?: string };

  if (!email) {
    return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://youguidealgarve.vercel.app";
    const destination = redirectTo ?? `${siteUrl}/nova-senha`;

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: destination },
    });

    if (linkError || !linkData?.properties?.action_link) {
      return NextResponse.json({ ok: true });
    }

    const resetLink = linkData.properties.action_link;

    await resend.emails.send({
      from: "Your Guide Algarve <noreply@yourguidealgarve.com>",
      to: email,
      subject: "Recuperação de senha — Your Guide Algarve",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
          <h1 style="font-size:22px;font-weight:800;color:#0a2540;margin-bottom:8px">
            Recuperação de senha
          </h1>
          <p style="font-size:15px;color:#4b5563;line-height:1.6">
            Recebemos um pedido para redefinir a senha da sua conta no
            <strong>Your Guide Algarve</strong>.
          </p>
          <p style="font-size:15px;color:#4b5563;line-height:1.6">
            Clique no botão abaixo para criar uma nova senha. O link expira em 1 hora.
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetLink}"
               style="background:#f5c518;color:#0a2540;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;display:inline-block">
              Redefinir senha
            </a>
          </div>
          <p style="font-size:12px;color:#9ca3af;line-height:1.6">
            Se você não solicitou a recuperação de senha, ignore este e-mail.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:12px;color:#9ca3af">
            Your Guide Algarve · Algarve, Portugal
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ ok: true });
  }
}
