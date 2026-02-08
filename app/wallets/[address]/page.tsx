import Link from "next/link";
import { getWallet, getWalletTransactions } from "@/lib/api";
import { formatXQR, formatXQRWhole, formatDate, timeAgo, truncateHash, getTxTypeLabel } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { Pagination } from "@/components/ui/Pagination";
import { Wallet, ArrowLeft } from "lucide-react";

export const revalidate = 15;

export default async function WalletDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { address } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));

  const [{ data: wallet }, txRes] = await Promise.all([
    getWallet(address),
    getWalletTransactions(address, page, 25),
  ]);

  const transactions = txRes.data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/wallets" className="inline-flex items-center gap-1 text-sm text-secondary hover:text-white mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to wallets
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" /> Wallet
        </h1>
      </div>

      <div className="card">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <span className="text-xs text-muted uppercase tracking-wider">Address</span>
              <div className="font-mono text-sm mt-1 flex items-center gap-1 break-all">
                {wallet.address} <CopyButton text={wallet.address} />
              </div>
            </div>
            {wallet.publicKey && (
              <div className="sm:col-span-2">
                <span className="text-xs text-muted uppercase tracking-wider">Public Key</span>
                <div className="font-mono text-sm mt-1 flex items-center gap-1 break-all text-secondary">
                  {wallet.publicKey} <CopyButton text={wallet.publicKey} />
                </div>
              </div>
            )}
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Balance</span>
              <div className="text-xl font-semibold mt-1 font-mono">{formatXQRWhole(wallet.balance)} XQR</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Nonce</span>
              <div className="text-sm mt-1 font-mono">{wallet.nonce}</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Delegate</span>
              <div className="text-sm mt-1">
                {wallet.isDelegate ? (
                  <span className="badge-primary">{wallet.username || "Yes"}</span>
                ) : (
                  <span className="text-muted">No</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Voting For</span>
              <div className="text-sm mt-1 font-mono">
                {wallet.vote ? (
                  <span className="text-secondary">{truncateHash(wallet.vote, 10, 10)}</span>
                ) : (
                  <span className="text-muted">Not voting</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-base font-semibold">Transactions</h3>
          <span className="text-xs text-secondary">{txRes.meta.totalCount.toLocaleString()} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-hover/30">
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header hidden sm:table-cell">Type</th>
                <th className="table-header hidden md:table-cell">From</th>
                <th className="table-header hidden md:table-cell">To</th>
                <th className="table-header text-right">Amount</th>
                <th className="table-header hidden lg:table-cell">Memo</th>
                <th className="table-header text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center text-muted py-8">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIncoming = tx.recipient === address;
                  return (
                    <tr key={tx.id} className="hover:bg-dark-hover/30 transition-colors">
                      <td className="table-cell font-mono text-sm">
                        <Link href={`/transactions/${tx.id}`} className="link">
                          {truncateHash(tx.id, 6, 6)}
                        </Link>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        <span className={isIncoming ? "badge-success" : "badge-warning"}>
                          {isIncoming ? "IN" : "OUT"}
                        </span>
                      </td>
                      <td className="table-cell hidden md:table-cell font-mono text-sm">
                        {tx.sender === address ? (
                          <span className="text-secondary">{truncateHash(tx.sender)}</span>
                        ) : (
                          <Link href={`/wallets/${tx.sender}`} className="link">{truncateHash(tx.sender)}</Link>
                        )}
                      </td>
                      <td className="table-cell hidden md:table-cell font-mono text-sm">
                        {tx.recipient ? (
                          tx.recipient === address ? (
                            <span className="text-secondary">{truncateHash(tx.recipient)}</span>
                          ) : (
                            <Link href={`/wallets/${tx.recipient}`} className="link">{truncateHash(tx.recipient)}</Link>
                          )
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className={`table-cell text-right font-mono ${isIncoming ? "text-success" : "text-white"}`}>
                        {isIncoming ? "+" : "-"}{formatXQR(tx.amount)} XQR
                      </td>
                      <td className="table-cell hidden lg:table-cell text-sm text-secondary max-w-[200px] truncate">
                        {tx.vendorField || <span className="text-muted">—</span>}
                      </td>
                      <td className="table-cell text-right text-secondary text-sm">
                        {timeAgo(tx.timestamp.unix)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.min(txRes.meta.pageCount, 100)}
        basePath={`/wallets/${address}`}
      />
    </div>
  );
}
