import { LegalPageView } from "@/components/site/legal-page";
import { getLegalPage } from "@/lib/legal-content";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const locale = await getLocale();
  const page = getLegalPage("partners", locale);
  return <LegalPageView page={page} />;
}
