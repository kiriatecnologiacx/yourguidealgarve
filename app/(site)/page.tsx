import { Hero } from "@/components/site/hero";
import { FeatureStrip } from "@/components/site/feature-strip";
import { FeaturedToursRail } from "@/components/site/featured-tours-rail";
import { CategoryRail } from "@/components/site/category-rail";
import { DestinationRail } from "@/components/site/destination-rail";
import { BlogCTA } from "@/components/site/blog-cta";
import { Newsletter } from "@/components/site/newsletter";
import { listCategories, listDestinations, getFeaturedTours } from "@/lib/data";
import { getLocale } from "@/lib/locale-server";
import { getFavoriteIds, getCurrentUser } from "@/lib/auth";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, destinations, featuredTours, locale, user, favIds] = await Promise.all([
    listCategories(),
    listDestinations(true),
    getFeaturedTours(8),
    getLocale(),
    getCurrentUser(),
    getFavoriteIds(),
  ]);

  const isAuthed = !!user;

  return (
    <>
      <Hero />
      <FeatureStrip />
      <FeaturedToursRail tours={featuredTours} locale={locale} isAuthed={isAuthed} favIds={favIds} />
      <CategoryRail categories={categories} />
      <DestinationRail destinations={destinations} />
      <BlogCTA />
      <Newsletter locale={locale} />
    </>
  );
}
