"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  Wallet,
  Vote,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/blocks", label: "Blocks", icon: Boxes },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/wallets", label: "Top Wallets", icon: Wallet },
  { href: "/delegates", label: "Delegates", icon: Vote },
  { href: "/peers", label: "Peers", icon: Globe },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const nav = (
    <nav className="flex flex-col gap-1 mt-4">
      <span className="px-7 mb-2 text-[0.65rem] text-muted uppercase tracking-widest">
        Explorer
      </span>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={isActive(item.href) ? "nav-item-active" : "nav-item"}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-md bg-dark-card border border-dark-border"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-60 bg-dark-bg border-r border-dark-border transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-dark-border">
          <Image src="/logo.png" alt="Qredit" width={131} height={30} priority />
        </div>
        {nav}
        <div className="absolute bottom-4 left-0 right-0 px-6">
          <div className="text-xs text-muted">
            QreditScan v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
