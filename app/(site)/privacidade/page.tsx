import { LegalPageView } from "@/components/site/legal-page";
import { getLegalPage } from "@/lib/legal-content";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const page = getLegalPage("privacy", locale);
  return <LegalPageView page={page} />;
}
