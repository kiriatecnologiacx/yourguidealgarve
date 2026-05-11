import { Logo } from "@/components/site/logo";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="min-h-screen bg-navy-800 grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1602410465647-ad9d04ce91a4?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 via-navy-800/60 to-navy-700/40" />
        <div className="relative h-full flex flex-col justify-between p-10 text-white">
          <Logo />
          <div>
            <h2 className="text-3xl font-extrabold leading-tight">
              Painel administrativo
            </h2>
            <p className="mt-2 text-white/85 max-w-sm">
              Gerencie passeios, parceiros e links de afiliado do
              Your Guide Algarve.
            </p>
          </div>
          <p className="text-[12px] text-white/60">© 2026 Your Guide Algarve</p>
        </div>
      </div>
      <div className="grid place-items-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-6">
            <Logo variant="dark" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-strong">Bem-vindo</h1>
          <p className="text-[13.5px] text-text-muted mt-1">
            Entre com suas credenciais para acessar o painel.
          </p>
          <div className="mt-6">
            <LoginForm next={sp.next} error={sp.error} />
          </div>
        </div>
      </div>
    </div>
  );
}
