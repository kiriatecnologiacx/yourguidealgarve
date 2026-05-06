import { Hero } from "@/components/site/hero";
import { FeatureStrip } from "@/components/site/feature-strip";
import { CategoryRail } from "@/components/site/category-rail";
import { DestinationRail } from "@/components/site/destination-rail";
import { BlogCTA } from "@/components/site/blog-cta";
import { ReviewsStrip } from "@/components/site/reviews-strip";
import { Newsletter } from "@/components/site/newsletter";
import { listCategories, listDestinations } from "@/lib/data";
import { getLocale } from "@/lib/locale-server";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, destinations, locale] = await Promise.all([
    listCategories(),
    listDestinations(true),
    getLocale(),
  ]);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <CategoryRail categories={categories} />
      <DestinationRail destinations={destinations} />
      <BlogCTA />
      <ReviewsStrip />
      <Newsletter locale={locale} />
    </>
  );
}
