import { Wallet, ShieldCheck, Tag, Headphones } from "lucide-react";

const ITEMS = [
  {
    icon: <Wallet className="w-5 h-5" />,
    title: "Cancelamento gratuito",
    subtitle: "Na maioria das atividades",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Reserve com segurança",
    subtitle: "Pagamento 100% seguro",
  },
  {
    icon: <Tag className="w-5 h-5" />,
    title: "Melhor preço garantido",
    subtitle: "Encontrou por menos? Avisamos você",
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: "Suporte 24/7",
    subtitle: "Estamos sempre disponíveis",
  },
];

export function FeatureStrip() {
  return (
    <section className="bg-white border-b border-border-subtle">
      <div className="mx-auto max-w-[1240px] px-5 py-6 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center gap-3.5">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-yellow-soft text-navy-700 shrink-0">
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-text-strong leading-tight">
                {item.title}
              </p>
              <p className="text-[12.5px] text-text-muted mt-0.5 leading-tight">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
