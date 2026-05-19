import { Logo } from "@/components/site/logo";
import { ResetRequestForm } from "@/components/admin/reset-request-form";

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen bg-navy-800 grid place-items-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        <div className="mb-6">
          <Logo variant="dark" />
        </div>
        <h1 className="text-[22px] font-extrabold text-text-strong">Recuperar senha</h1>
        <p className="text-[13.5px] text-text-muted mt-1">
          Informe o seu e-mail e receberá um link para redefinir a senha.
        </p>
        <div className="mt-6">
          <ResetRequestForm />
        </div>
      </div>
    </div>
  );
}
