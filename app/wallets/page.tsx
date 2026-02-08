import Link from "next/link";
import { getWallets } from "@/lib/api";
import { formatXQR, truncateHash } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { Wallet } from "lucide-react";

export const revalidate = 30;

export default async function WalletsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const { data: wallets, meta } = await getWallets(page, 25);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" /> Top Wallets
        </h1>
        <p className="text-sm text-secondary mt-1">
          {meta.totalCount.toLocaleString()} wallets — sorted by balance
        </p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-hover/30">
              <tr>
                <th className="table-header w-16">#</th>
                <th className="table-header">Address</th>
                <th className="table-header text-right">Balance</th>
                <th className="table-header text-center hidden sm:table-cell">Delegate</th>
                <th className="table-header text-center hidden md:table-cell">Voting</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet, idx) => (
                <tr key={wallet.address} className="hover:bg-dark-hover/30 transition-colors">
                  <td className="table-cell text-muted font-mono text-sm">
                    {(page - 1) * 25 + idx + 1}
                  </td>
                  <td className="table-cell font-mono text-sm">
                    <Link href={`/wallets/${wallet.address}`} className="link">
                      <span className="hidden lg:inline">{wallet.address}</span>
                      <span className="lg:hidden">{truncateHash(wallet.address, 10, 8)}</span>
                    </Link>
                  </td>
                  <td className="table-cell text-right font-mono">
                    {formatXQR(wallet.balance)} XQR
                  </td>
                  <td className="table-cell text-center hidden sm:table-cell">
                    {wallet.isDelegate ? (
                      <span className="badge-primary">{wallet.username || "Yes"}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="table-cell text-center hidden md:table-cell">
                    {wallet.vote ? (
                      <span className="badge-success">Yes</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={Math.min(meta.pageCount, 100)} basePath="/wallets" />
    </div>
  );
}
