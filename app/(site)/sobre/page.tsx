import { LegalPageView } from "@/components/site/legal-page";
import { getLegalPage } from "@/lib/legal-content";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function SobrePage() {
  const locale = await getLocale();
  const page = getLegalPage("about", locale);
  return <LegalPageView page={page} />;
}
