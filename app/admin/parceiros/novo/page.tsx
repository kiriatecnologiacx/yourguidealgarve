import { PartnerForm } from "@/components/admin/partner-form";

export default function NewPartnerPage() {
  return (
    <div className="px-6 lg:px-10 py-8 max-w-3xl">
      <h1 className="text-2xl font-extrabold text-text-strong mb-6">Novo parceiro</h1>
      <PartnerForm />
    </div>
  );
}
