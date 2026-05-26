export type Tour = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  cover_image: string | null;
  gallery: string[];
  price_brl: number | null;
  price_from_brl: number | null;
  duration: string | null;
  rating: number | null;
  reviews_count: number;
  destination_id: string | null;
  category_id: string | null;
  partner_id: string | null;
  affiliate_url: string | null;
  booking_widget_url: string | null;
  booking_widget_html: string | null;
  meeting_point: string | null;
  included: string[];
  not_included: string[];
  highlights: string[];
  free_cancellation: boolean;
  is_featured: boolean;
  is_published: boolean;
  hide_price: boolean;
  badge: string | null;
  tour_mode: "widget" | "complete";
  important_info: string | null;
  what_to_bring: string | null;
  tips: string | null;
  languages: string[];
  title_pt: string | null;
  title_fr: string | null;
  short_description_pt: string | null;
  short_description_fr: string | null;
  description_pt: string | null;
  description_fr: string | null;
  highlights_pt: string[];
  highlights_fr: string[];
  created_at: string;
};

export type Destination = {
  id: string;
  slug: string;
  name: string;
  image: string;
  activities_count: number;
  is_featured: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  image: string;
  icon: string | null;
  position: number;
};

export type Partner = {
  id: string;
  name: string;
  website: string | null;
  contact_email: string | null;
  notes: string | null;
};

export type AdminUser = {
  id: string;
  email: string;
  role: "owner" | "editor";
  created_at: string;
};

export type TourWithRelations = Tour & {
  destination: Destination | null;
  category: Category | null;
  partner: Partner | null;
};

export type Review = {
  id: string;
  tour_id: string;
  author_name: string;
  rating: number;
  body: string;
  created_at: string;
  approved: boolean;
};
