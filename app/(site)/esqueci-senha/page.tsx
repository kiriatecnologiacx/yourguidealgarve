import { ForgotPasswordForm } from "@/components/site/forgot-password-form";

export default function EsqueciSenhaPage() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] font-extrabold text-text-strong">Recuperar senha</h1>
        <p className="text-[13.5px] text-text-muted mt-1">
          Informe o seu e-mail e receberá um link para redefinir a senha.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
