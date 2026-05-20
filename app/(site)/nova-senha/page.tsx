import { SiteNewPasswordForm } from "@/components/site/new-password-form";

export default function NovaSenhaPage() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] font-extrabold text-text-strong">Nova senha</h1>
        <p className="text-[13.5px] text-text-muted mt-1">Escolha uma senha forte para a sua conta.</p>
        <div className="mt-6">
          <SiteNewPasswordForm />
        </div>
      </div>
    </div>
  );
}
