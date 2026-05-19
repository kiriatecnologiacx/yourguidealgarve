import { Logo } from "@/components/site/logo";
import { NewPasswordForm } from "@/components/admin/new-password-form";

export default function NovaSenhaPage() {
  return (
    <div className="min-h-screen bg-navy-800 grid place-items-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        <div className="mb-6">
          <Logo variant="dark" />
        </div>
        <h1 className="text-[22px] font-extrabold text-text-strong">Definir nova senha</h1>
        <p className="text-[13.5px] text-text-muted mt-1">
          Escolha uma senha forte para a sua conta.
        </p>
        <div className="mt-6">
          <NewPasswordForm />
        </div>
      </div>
    </div>
  );
}
