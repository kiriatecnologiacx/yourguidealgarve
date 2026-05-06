import Image from "next/image";
import { AuthForm } from "@/components/site/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <section className="bg-surface-alt">
      <div className="mx-auto max-w-[1100px] px-5 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white rounded-2xl border border-border-subtle p-8">
          <h1 className="font-display text-3xl font-extrabold text-text-strong">
            Bem-vindo de volta
          </h1>
          <p className="mt-1 text-[13.5px] text-text-muted">
            Entre para favoritar passeios e acompanhar suas reservas.
          </p>
          <div className="mt-6">
            <AuthForm mode="signin" redirectTo={next} />
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden hidden md:block">
          <Image
            src="https://images.unsplash.com/photo-1597577183330-5cf2a5c6e63b?auto=format&fit=crop&w=1400&q=80"
            alt="Algarve"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,37,64,0.65) 0%, rgba(255,138,61,0.35) 100%)",
            }}
          />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <h2 className="font-display text-2xl font-extrabold leading-tight max-w-xs">
              Suas próximas aventuras te esperam.
            </h2>
            <p className="text-[13.5px] text-white/85 mt-2 max-w-xs">
              Salve seus passeios favoritos e descubra inspirações no nosso blog.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
