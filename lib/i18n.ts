export type Locale = "pt-BR" | "pt-PT" | "en";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  { code: "pt-PT", label: "Português (PT)", flag: "🇵🇹" },
  { code: "en",    label: "English",        flag: "🇬🇧" },
];

export const DEFAULT_LOCALE: Locale = "pt-BR";

const dict: Record<Locale, Record<string, string>> = {
  "pt-BR": {
    "nav.destinations": "Destinos",
    "nav.activities":   "Atividades",
    "nav.experiences":  "Experiências",
    "nav.tickets":      "Ingressos",
    "nav.transfers":    "Transfers",
    "nav.offers":       "Ofertas",
    "nav.blog":         "Blog",
    "header.favorites": "Favoritos",
    "header.cart":      "Carrinho",
    "header.signIn":    "Entrar",
    "footer.about":     "Sobre nós",
    "footer.aboutUs":   "Quem somos",
    "footer.partner":   "Seja um parceiro",
    "footer.copy":      "Desenvolvido por Kíria Tecnologia",
  },
  "pt-PT": {
    "nav.destinations": "Destinos",
    "nav.activities":   "Atividades",
    "nav.experiences":  "Experiências",
    "nav.tickets":      "Bilhetes",
    "nav.transfers":    "Transferes",
    "nav.offers":       "Ofertas",
    "nav.blog":         "Blog",
    "header.favorites": "Favoritos",
    "header.cart":      "Carrinho",
    "header.signIn":    "Entrar",
    "footer.about":     "Sobre nós",
    "footer.aboutUs":   "Quem somos",
    "footer.partner":   "Seja um parceiro",
    "footer.copy":      "Desenvolvido por Kíria Tecnologia",
  },
  "en": {
    "nav.destinations": "Destinations",
    "nav.activities":   "Activities",
    "nav.experiences":  "Experiences",
    "nav.tickets":      "Tickets",
    "nav.transfers":    "Transfers",
    "nav.offers":       "Offers",
    "nav.blog":         "Blog",
    "header.favorites": "Favorites",
    "header.cart":      "Cart",
    "header.signIn":    "Sign in",
    "footer.about":     "About",
    "footer.aboutUs":   "About us",
    "footer.partner":   "Become a partner",
    "footer.copy":      "Developed by Kíria Tecnologia",
  },
};

export function t(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? dict[DEFAULT_LOCALE][key] ?? key;
}
