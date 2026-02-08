import Link from "next/link";
import { getTransaction } from "@/lib/api";
import { formatXQR, formatDate, timeAgo, getTxTypeLabel, getTxTypeBadgeClass } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { ArrowLeftRight, ArrowLeft } from "lucide-react";

export const revalidate = 8;

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: tx } = await getTransaction(id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/transactions" className="inline-flex items-center gap-1 text-sm text-secondary hover:text-white mb-2">
          <ArrowLeft className="w-4 h-4" /> Back to transactions
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6 text-primary" /> Transaction
        </h1>
      </div>

      <div className="card">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <span className="text-xs text-muted uppercase tracking-wider">Transaction ID</span>
              <div className="font-mono text-sm mt-1 flex items-center gap-1 break-all">
                {tx.id} <CopyButton text={tx.id} />
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Type</span>
              <div className="mt-1">
                <span className={getTxTypeBadgeClass(tx.type, tx.typeGroup)}>{getTxTypeLabel(tx.type, tx.typeGroup)}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Timestamp</span>
              <div className="text-sm mt-1">{formatDate(tx.timestamp.unix)}</div>
              <div className="text-xs text-secondary">{timeAgo(tx.timestamp.unix)}</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Sender</span>
              <div className="font-mono text-sm mt-1 flex items-center gap-1 break-all">
                <Link href={`/wallets/${tx.sender}`} className="link">{tx.sender}</Link>
                <CopyButton text={tx.sender} />
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Recipient</span>
              <div className="font-mono text-sm mt-1 flex items-center gap-1 break-all">
                {tx.recipient ? (
                  <>
                    <Link href={`/wallets/${tx.recipient}`} className="link">{tx.recipient}</Link>
                    <CopyButton text={tx.recipient} />
                  </>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Amount</span>
              <div className="text-sm mt-1 font-mono">{formatXQR(tx.amount)} XQR</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Fee</span>
              <div className="text-sm mt-1 font-mono">{formatXQR(tx.fee)} XQR</div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Block</span>
              <div className="text-sm mt-1">
                <Link href={`/blocks/${tx.blockId}`} className="link font-mono">
                  {tx.blockId.slice(0, 16)}...
                </Link>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Confirmations</span>
              <div className="text-sm mt-1">
                {tx.confirmations.toLocaleString()}
                {tx.confirmations > 10 && (
                  <span className="badge-success ml-2">Confirmed</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider">Nonce</span>
              <div className="text-sm mt-1 font-mono">{tx.nonce}</div>
            </div>
            {tx.vendorField && (
              <div className="sm:col-span-2">
                <span className="text-xs text-muted uppercase tracking-wider">Vendor Field</span>
                <div className="text-sm mt-1 font-mono bg-dark-hover/50 px-3 py-2 rounded-md break-all">
                  {tx.vendorField}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
