import { Hero } from "@/components/site/hero";
import { FeatureStrip } from "@/components/site/feature-strip";
import { CategoryRail } from "@/components/site/category-rail";
import { DestinationRail } from "@/components/site/destination-rail";
import { AppPromo } from "@/components/site/app-promo";
import { ReviewsStrip } from "@/components/site/reviews-strip";
import { Newsletter } from "@/components/site/newsletter";
import { listCategories, listDestinations } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, destinations] = await Promise.all([
    listCategories(),
    listDestinations(true),
  ]);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <CategoryRail categories={categories} />
      <DestinationRail destinations={destinations} />
      <AppPromo />
      <ReviewsStrip />
      <Newsletter />
    </>
  );
}
