"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Clock, Minus, Plus, ShieldCheck, MessageCircle, Mail, Headphones } from "lucide-react";
import type { Tour } from "@/lib/types";
import { formatPriceBRL } from "@/lib/utils";

const DAYS = [
  { d: "Hoje", n: 21, m: "Mai" },
  { d: "Qua", n: 22, m: "Mai" },
  { d: "Qui", n: 23, m: "Mai" },
  { d: "Sex", n: 24, m: "Mai" },
  { d: "Sáb", n: 25, m: "Mai" },
  { d: "Dom", n: 26, m: "Mai" },
];

const TIMES = ["09:00", "11:30", "14:00", "16:30"];

export function BookingWidget({ tour }: { tour: Tour }) {
  const [date, setDate] = useState(1);
  const [time, setTime] = useState(1);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [babies, setBabies] = useState(0);

  const basePrice = tour.price_brl ?? tour.price_from_brl ?? 0;
  const total = adults * basePrice + kids * Math.round(basePrice * 0.6);

  return (
    <aside className="bg-white rounded-2xl border border-border-subtle p-5 lg:sticky lg:top-6 self-start">
      <p className="text-[13px] text-text-muted">A partir de</p>
      <p className="text-[28px] font-extrabold text-text-strong leading-tight">
        {formatPriceBRL(tour.price_from_brl ?? tour.price_brl)}{" "}
        <span className="text-[13px] font-medium text-text-muted">por pessoa</span>
      </p>
      <p className="mt-1 text-[12.5px] text-success font-medium">
        Cancelamento gratuito
      </p>

      <div className="mt-5">
        <p className="text-[13px] font-semibold text-text-strong mb-2">
          Selecione a data
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {DAYS.map((d, i) => (
            <button
              key={i}
              onClick={() => setDate(i)}
              className={`flex flex-col items-center py-2 rounded-lg text-[11.5px] border ${
                i === date
                  ? "border-brand-yellow bg-brand-yellow text-navy-900"
                  : "border-border-subtle hover:bg-surface-alt"
              }`}
            >
              <span className="opacity-80">{d.d}</span>
              <span className="font-bold text-[14px]">{d.n}</span>
              <span className="opacity-80">{d.m}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[13px] font-semibold text-text-strong mb-2">
          Selecione o horário
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {TIMES.map((t, i) => (
            <button
              key={t}
              onClick={() => setTime(i)}
              className={`py-2 rounded-lg text-[12.5px] font-semibold border flex items-center justify-center gap-1 ${
                i === time
                  ? "border-brand-yellow bg-brand-yellow text-navy-900"
                  : "border-border-subtle hover:bg-surface-alt"
              }`}
            >
              <Clock className="w-3 h-3 opacity-70" />
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[13px] font-semibold text-text-strong mb-2">
          Selecione o número de pessoas
        </p>
        <Counter label="Adulto" sub="(13-99 anos)" value={adults} setValue={setAdults} />
        <Counter label="Criança" sub="(3-12 anos)" value={kids} setValue={setKids} />
        <Counter label="Bebê" sub="(0-2 anos)" value={babies} setValue={setBabies} />
      </div>

      <div className="mt-5 pt-4 border-t border-border-subtle flex items-center justify-between">
        <span className="text-[13px] text-text-muted">Total</span>
        <span className="text-[20px] font-extrabold text-text-strong">
          {formatPriceBRL(total)}
        </span>
      </div>

      {tour.affiliate_url ? (
        <a
          href={tour.affiliate_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-3 block text-center bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-4 py-3 rounded-xl text-[14.5px]"
        >
          Reservar agora
        </a>
      ) : (
        <button
          type="button"
          className="mt-3 block w-full text-center bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-4 py-3 rounded-xl text-[14.5px]"
        >
          Reservar agora
        </button>
      )}
      <button className="mt-2 w-full bg-white border border-navy-700 text-navy-800 font-semibold px-4 py-3 rounded-xl text-[14px] hover:bg-surface-alt">
        Adicionar ao carrinho
      </button>

      <ul className="mt-4 space-y-2 text-[12.5px] text-text-muted">
        <li className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-navy-700" />
          Reserve agora, pague depois
        </li>
        <li className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-navy-700" />
          Confirmação imediata
        </li>
      </ul>

      <div className="mt-4 pt-4 border-t border-border-subtle">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-text-strong">
          <Headphones className="w-4 h-4" /> Precisa de ajuda?
        </p>
        <p className="text-[12px] text-text-muted mt-1">
          Fale com a nossa equipe pelo WhatsApp ou e-mail. Estamos prontos para ajudar.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1 bg-success text-white text-[12.5px] font-semibold px-3 py-2 rounded-lg hover:opacity-90">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
          <button className="flex items-center justify-center gap-1 bg-navy-800 text-white text-[12.5px] font-semibold px-3 py-2 rounded-lg hover:bg-navy-700">
            <Mail className="w-3.5 h-3.5" /> E-mail
          </button>
        </div>
      </div>
    </aside>
  );
}

function Counter({
  label,
  sub,
  value,
  setValue,
}: {
  label: string;
  sub: string;
  value: number;
  setValue: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] text-text-strong">
        {label}{" "}
        <span className="text-text-muted text-[12px]">{sub}</span>
      </span>
      <span className="flex items-center gap-3">
        <button
          aria-label="Diminuir"
          onClick={() => setValue(Math.max(0, value - 1))}
          className="w-7 h-7 rounded-full border border-border-subtle grid place-items-center hover:bg-surface-alt"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-5 text-center text-[14px] font-semibold">{value}</span>
        <button
          aria-label="Aumentar"
          onClick={() => setValue(value + 1)}
          className="w-7 h-7 rounded-full border border-border-subtle grid place-items-center hover:bg-surface-alt"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </span>
    </div>
  );
}
