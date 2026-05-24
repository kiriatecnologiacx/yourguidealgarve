import Link from "next/link";
import { ContactForm } from "@/components/site/contact-form";
import { Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <>
      <section className="bg-navy-800 text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-10">
          <p className="text-[12.5px] text-white/70">
            <Link href="/" className="hover:text-white">Início</Link>{" "}
            <span className="mx-1">›</span> Contacte-nos
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">Contacte-nos</h1>
          <p className="mt-1 text-white/80 text-[14px]">Estamos aqui para ajudar</p>
        </div>
      </section>

      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[1240px] px-5 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* Contact form */}
          <div>
            <h2 className="font-display text-[22px] font-bold text-text-strong mb-6">
              Envie-nos uma mensagem
            </h2>
            <ContactForm />
          </div>

          {/* Contact options */}
          <div className="space-y-4">
            <h2 className="font-display text-[22px] font-bold text-text-strong">
              Outras formas de contacto
            </h2>

            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl p-5 hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-text-strong">WhatsApp</p>
                  <p className="text-[13px] text-text-muted mt-0.5">Resposta rápida — normalmente em menos de 1h</p>
                  <p className="text-[13.5px] font-semibold text-green-700 mt-1">{whatsappNumber}</p>
                </div>
              </a>
            ) : null}

            <a
              href="mailto:info@yourguidealgarve.com"
              className="flex items-start gap-4 bg-white border border-border-subtle rounded-2xl p-5 hover:bg-surface-alt transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-text-strong">Email</p>
                <p className="text-[13px] text-text-muted mt-0.5">Respondemos em 24 horas úteis</p>
                <p className="text-[13.5px] font-semibold text-navy-700 mt-1">info@yourguidealgarve.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
