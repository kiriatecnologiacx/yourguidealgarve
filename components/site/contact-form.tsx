"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitContact } from "@/app/(site)/contacto/actions";
import { t, type Locale } from "@/lib/i18n";

const fc = "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(submitContact, null);

  if (state?.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-[16px] font-semibold text-green-800">{t(locale, "contact.success")}</p>
        <p className="text-[14px] text-green-700 mt-1">{t(locale, "contact.successSub")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-text-strong mb-1">{t(locale, "contact.label.name")}</label>
          <input name="name" required className={fc} placeholder={t(locale, "contact.placeholder.name")} />
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-text-strong mb-1">{t(locale, "contact.label.email")}</label>
          <input name="email" type="email" required className={fc} placeholder={t(locale, "contact.placeholder.email")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-text-strong mb-1">{t(locale, "contact.label.phone")}</label>
          <input name="phone" className={fc} placeholder={t(locale, "contact.placeholder.phone")} />
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-text-strong mb-1">{t(locale, "contact.label.subject")}</label>
          <input name="subject" className={fc} placeholder={t(locale, "contact.placeholder.subject")} />
        </div>
      </div>
      <div>
        <label className="block text-[12.5px] font-semibold text-text-strong mb-1">{t(locale, "contact.label.message")}</label>
        <textarea name="message" required rows={5} className={fc} placeholder={t(locale, "contact.placeholder.message")} />
      </div>

      {state?.error ? (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-6 py-3 rounded-xl text-[15px] disabled:opacity-60"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {t(locale, "contact.submit")}
      </button>
    </form>
  );
}
