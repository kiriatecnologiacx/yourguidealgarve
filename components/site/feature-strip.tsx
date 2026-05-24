import { Wallet, ShieldCheck, Users, Headphones } from "lucide-react";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function FeatureStrip() {
  const locale = await getLocale();
  const items = [
    { icon: <Wallet className="w-5 h-5" />,       title: t(locale, "feat.cancel.title"),  subtitle: t(locale, "feat.cancel.subtitle") },
    { icon: <ShieldCheck className="w-5 h-5" />,  title: t(locale, "feat.secure.title"),  subtitle: t(locale, "feat.secure.subtitle") },
    { icon: <Users className="w-5 h-5" />,         title: t(locale, "feat.price.title"),   subtitle: t(locale, "feat.price.subtitle") },
    { icon: <Headphones className="w-5 h-5" />,   title: t(locale, "feat.support.title"), subtitle: t(locale, "feat.support.subtitle") },
  ];
  return (
    <section className="bg-white border-b border-border-subtle">
      <div className="mx-auto max-w-[1240px] px-5 py-6 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3.5">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-yellow-soft text-navy-700 shrink-0">
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-text-strong leading-tight">
                {item.title}
              </p>
              <p className="text-[12.5px] text-text-muted mt-0.5 leading-tight">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
