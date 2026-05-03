"use client";

import { MapPin, Calendar as CalendarIcon, Users, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Field = {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
};

const FIELDS: Field[] = [
  { icon: <MapPin className="w-4 h-4 text-navy-600" />, label: "Para onde você vai?", placeholder: "Digite um destino ou atração" },
  { icon: <CalendarIcon className="w-4 h-4 text-navy-600" />, label: "Data", placeholder: "Selecione a data" },
  { icon: <Users className="w-4 h-4 text-navy-600" />, label: "Pessoas", placeholder: "Quem vai?" },
];

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/atividades?q=${encodeURIComponent(query)}`);
      }}
      className="bg-white rounded-2xl shadow-[0_20px_50px_-20px_rgba(10,37,64,0.45)] p-2.5 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-2 max-w-[920px]"
    >
      {FIELDS.map((f, i) => (
        <label
          key={f.label}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent md:border-r md:border-border-subtle md:rounded-none md:px-4 md:last:border-r-0 hover:bg-surface-alt md:hover:bg-transparent cursor-text"
        >
          <span className="shrink-0">{f.icon}</span>
          <span className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-text-strong uppercase tracking-wide">
              {f.label}
            </span>
            <input
              type="text"
              placeholder={f.placeholder}
              value={i === 0 ? query : undefined}
              onChange={i === 0 ? (e) => setQuery(e.target.value) : undefined}
              className="bg-transparent text-[13.5px] text-text-strong placeholder:text-text-muted outline-none w-full mt-0.5"
            />
          </span>
        </label>
      ))}

      <button
        type="submit"
        className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] transition-colors"
      >
        <Search className="w-4 h-4" />
        Buscar experiências
      </button>
    </form>
  );
}
