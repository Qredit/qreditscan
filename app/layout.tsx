import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "QreditScan — Qredit Block Explorer",
  description: "Fast, open-source block explorer for the Qredit blockchain. Browse blocks, transactions, wallets, delegates, and peers.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Sidebar />
        <div className="lg:ml-60">
          <Header />
          <main className="px-4 py-4 lg:px-8 lg:py-6 min-h-[calc(100vh-60px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
