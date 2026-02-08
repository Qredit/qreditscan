import Link from "next/link";
import { getTransactions } from "@/lib/api";
import { formatXQR, timeAgo, truncateHash, getTxTypeLabel } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { ArrowLeftRight } from "lucide-react";

export const revalidate = 8;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const { data: transactions, meta } = await getTransactions(page, 25);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <ArrowLeftRight className="w-6 h-6 text-primary" /> Transactions
        </h1>
        <p className="text-sm text-secondary mt-1">
          {meta.totalCount.toLocaleString()} transactions total
        </p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-hover/30">
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header hidden sm:table-cell">Type</th>
                <th className="table-header hidden md:table-cell">From</th>
                <th className="table-header hidden md:table-cell">To</th>
                <th className="table-header text-right">Amount</th>
                <th className="table-header text-right hidden sm:table-cell">Fee</th>
                <th className="table-header text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
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
                  <td className="table-cell text-right font-mono text-secondary hidden sm:table-cell">
                    {formatXQR(tx.fee)}
                  </td>
                  <td className="table-cell text-right text-secondary text-sm">
                    {timeAgo(tx.timestamp.unix)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={Math.min(meta.pageCount, 400)} basePath="/transactions" />
    </div>
  );
}
