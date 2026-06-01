import Image from "next/image";
import { AuthForm } from "@/components/site/auth-form";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, locale] = await Promise.all([searchParams, getLocale()]);
  return (
    <section className="bg-surface-alt">
      <div className="mx-auto max-w-[1100px] px-5 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white rounded-2xl border border-border-subtle p-8">
          <h1 className="font-display text-3xl font-extrabold text-text-strong">
            {t(locale, "auth.createAccount")}
          </h1>
          <div className="mt-6">
            <AuthForm mode="signup" redirectTo={next} locale={locale} />
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden hidden md:block">
          <Image
            src="/photos/auth-side.jpg"
            alt="Algarve cliff path"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,37,64,0.25) 0%, rgba(10,37,64,0.85) 100%), linear-gradient(135deg, rgba(255,204,0,0.30) 0%, transparent 60%)",
            }}
          />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <h2 className="font-display text-2xl font-extrabold leading-tight max-w-xs drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)]">
              Start your Algarve story.
            </h2>
            <p className="text-[13.5px] text-white/90 mt-2 max-w-xs drop-shadow">
              Sign up to save tours, get tips and access exclusive offers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
