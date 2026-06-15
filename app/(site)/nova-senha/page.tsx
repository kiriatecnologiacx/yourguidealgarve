import { SiteNewPasswordForm } from "@/components/site/new-password-form";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function NovaSenhaPage() {
  const locale = await getLocale();
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] font-extrabold text-text-strong">{t(locale, "password.pageTitle")}</h1>
        <p className="text-[13.5px] text-text-muted mt-1">{t(locale, "password.pageSubtitle")}</p>
        <div className="mt-6">
          <SiteNewPasswordForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
