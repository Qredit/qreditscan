import Link from "next/link";
import { getBlock, getBlockTransactions } from "@/lib/api";
import { formatXQR, formatDate, timeAgo, truncateHash, getTxTypeLabel } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { Boxes, ArrowLeft } from "lucide-react";

export const revalidate = 8;

export default async function BlockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: block } = await getBlock(id);

  let transactions = null;
  if (block.transactions > 0) {
    transactions = await getBlockTransactions(id, 1, 50);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/blocks" className="inline-flex items-center gap-1 text-sm text-secondary hover:text-white mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to blocks
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <Boxes className="w-6 h-6 text-primary" /> Block #{block.height.toLocaleString()}
        </h1>
      </div>

      <div className="card">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Block ID</span>
              <div className="font-mono text-sm mt-1 flex items-center gap-1 break-all">
                {block.id} <CopyButton text={block.id} />
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Height</span>
              <div className="text-sm mt-1">{block.height.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Timestamp</span>
              <div className="text-sm mt-1">{formatDate(block.timestamp.unix)}</div>
              <div className="text-xs text-secondary">{timeAgo(block.timestamp.unix)}</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Delegate</span>
              <div className="text-sm mt-1">
                <Link href={`/wallets/${block.generator.address}`} className="link">
                  {block.generator.username || block.generator.address}
                </Link>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Transactions</span>
              <div className="text-sm mt-1">{block.transactions}</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Confirmations</span>
              <div className="text-sm mt-1">{block.confirmations.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Reward</span>
              <div className="text-sm mt-1 font-mono">{formatXQR(block.forged.reward)} XQR</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Total Fee</span>
              <div className="text-sm mt-1 font-mono">{formatXQR(block.forged.fee)} XQR</div>
            </div>
          </div>
        </div>
      </div>

      {transactions && transactions.data.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-base font-semibold">Transactions in this block</h3>
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
                  <th className="table-header text-right">Fee</th>
                </tr>
              </thead>
              <tbody>
                {transactions.data.map((tx) => (
                  <tr key={tx.id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="table-cell font-mono text-sm">
                      <Link href={`/transactions/${tx.id}`} className="link">
                        {truncateHash(tx.id, 6, 6)}
                      </Link>
                    </td>
                    <td className="table-cell hidden sm:table-cell">
                      <span className="badge-primary">{getTxTypeLabel(tx.type, tx.typeGroup)}</span>
                    </td>
                    <td className="table-cell hidden md:table-cell font-mono text-sm">
                      <Link href={`/wallets/${tx.sender}`} className="link">
                        {truncateHash(tx.sender)}
                      </Link>
                    </td>
                    <td className="table-cell hidden md:table-cell font-mono text-sm">
                      {tx.recipient ? (
                        <Link href={`/wallets/${tx.recipient}`} className="link">
                          {truncateHash(tx.recipient)}
                        </Link>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="table-cell text-right font-mono">{formatXQR(tx.amount)} XQR</td>
                    <td className="table-cell text-right font-mono text-secondary">{formatXQR(tx.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
