"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  UserCog,
  Menu,
  X,
  HelpCircle,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/passeios", label: "Passeios", icon: Compass },
  { href: "/admin/destinos", label: "Destinos", icon: MapPin },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/contacto", label: "Contactos", icon: Phone },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/admin/parceiros", label: "Parceiros", icon: Users },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/equipe", label: "Equipe & Acessos", icon: UserCog },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/ajuda", label: "Ajuda — Widgets", icon: BookOpen },
];

function SidebarContent({ email, onClose }: { email: string | null; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <Logo />
        {onClose ? (
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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
    </>
  );
}

export function AdminSidebar({ email }: { email: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="bg-navy-800 text-white w-64 shrink-0 hidden lg:flex flex-col">
        <SidebarContent email={email} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy-800 text-white h-14 flex items-center px-4 gap-3 border-b border-white/10">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-md text-white/85 hover:text-white hover:bg-white/5"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Logo />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen ? (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-navy-800 text-white flex flex-col">
            <SidebarContent email={email} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
