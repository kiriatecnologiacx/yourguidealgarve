import { LegalPageView } from "@/components/site/legal-page";
import { getLegalPage } from "@/lib/legal-content";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const locale = await getLocale();
  const page = getLegalPage("terms", locale);
  return <LegalPageView page={page} />;
}
