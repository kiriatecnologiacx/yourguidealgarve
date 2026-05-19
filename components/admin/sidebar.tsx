"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Users,
  Tags,
  MapPin,
  Newspaper,
  BookOpen,
  LogOut,
  ExternalLink,
  Star,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/passeios", label: "Passeios", icon: Compass },
  { href: "/admin/destinos", label: "Destinos", icon: MapPin },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/admin/parceiros", label: "Parceiros", icon: Users },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/ajuda", label: "Ajuda — Widgets", icon: BookOpen },
];

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="bg-navy-800 text-white w-64 shrink-0 hidden lg:flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/75 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon className="w-4 h-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/75 hover:text-white hover:bg-white/5"
        >
          <ExternalLink className="w-4 h-4" /> Ver site
        </Link>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/75 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </form>
        {email ? (
          <p className="px-3 pt-2 text-[11px] text-white/50 truncate">{email}</p>
        ) : null}
      </div>
    </aside>
  );
}
