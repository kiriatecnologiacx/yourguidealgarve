"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";

export function MobileMenu({
  nav,
  favoritesLabel,
}: {
  nav: { label: string; href: string }[];
  favoritesLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md text-white/85 hover:text-white hover:bg-white/5"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-navy-800 flex flex-col">
            <div className="flex items-center justify-between px-5 h-[68px] border-b border-white/10">
              <span className="text-white font-semibold text-[15px]">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-md text-white/85 hover:text-white hover:bg-white/5"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-[15px] font-medium text-white/85 hover:text-white hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/favoritos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-[15px] font-medium text-white/85 hover:text-white hover:bg-white/5"
              >
                <Heart className="w-4 h-4" /> {favoritesLabel}
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
