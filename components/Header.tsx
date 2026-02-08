"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.type && data.id) {
          const routes: Record<string, string> = {
            block: "/blocks/",
            transaction: "/transactions/",
            wallet: "/wallets/",
          };
          router.push(`${routes[data.type]}${data.id}`);
          setQuery("");
        }
      } catch {
        // no result
      }
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border flex items-center px-4 lg:px-8 gap-4">
      <div className="ml-10 lg:ml-0 flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by block, transaction, address, or delegate..."
            className="input pl-10 pr-4"
            disabled={isPending}
          />
        </form>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-secondary">
        <span className="status-dot-success" />
        <span>Qredit Mainnet</span>
      </div>
    </header>
  );
}
