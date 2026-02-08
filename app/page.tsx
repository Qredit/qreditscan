import Link from "next/link";
import { getBlockchain, getNodeStatus, getBlocks, getTransactions, getDelegates } from "@/lib/api";
import { formatXQR, formatSupply, timeAgo, truncateHash, getTxTypeLabel, getTxTypeBadgeClass } from "@/lib/utils";
import { Boxes, ArrowLeftRight, Vote, Activity, Database, Clock } from "lucide-react";

export const revalidate = 8;

export default async function Dashboard() {
  const [blockchain, status, blocksRes, txRes, delegatesRes] = await Promise.all([
    getBlockchain(),
    getNodeStatus(),
    getBlocks(1, 10),
    getTransactions(1, 10),
    getDelegates(1, 51),
  ]);

  const blocks = blocksRes.data;
  const transactions = txRes.data;
  const activeDelegates = delegatesRes.data.filter((d) => !d.isResigned).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-secondary mt-1">Qredit blockchain overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        <div className="stat-tile">
          <div className="stat-label flex items-center gap-1.5"><Boxes className="w-3 h-3" /> Height</div>
          <div className="stat-value">{blockchain.block.height.toLocaleString()}</div>
          <div className="stat-sub flex items-center gap-1">
            <span className="status-dot-success" />
            {status.synced ? "Synced" : "Syncing"}
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label flex items-center gap-1.5"><Database className="w-3 h-3" /> Supply</div>
          <div className="stat-value">{formatSupply(blockchain.supply)}</div>
          <div className="stat-sub">XQR</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label flex items-center gap-1.5"><ArrowLeftRight className="w-3 h-3" /> Transactions</div>
          <div className="stat-value">{txRes.meta.totalCount.toLocaleString()}</div>
          <div className="stat-sub">Total</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label flex items-center gap-1.5"><Vote className="w-3 h-3" /> Delegates</div>
          <div className="stat-value">{activeDelegates}</div>
          <div className="stat-sub">Active</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label flex items-center gap-1.5"><Clock className="w-3 h-3" /> Block Time</div>
          <div className="stat-value">8s</div>
          <div className="stat-sub">Target</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label flex items-center gap-1.5"><Activity className="w-3 h-3" /> Reward</div>
          <div className="stat-value">1 XQR</div>
          <div className="stat-sub">Per block</div>
        </div>
      </div>

      {/* Two-column: Latest Blocks + Latest Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Latest Blocks */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-primary" />
              <h3 className="text-base font-semibold">Latest Blocks</h3>
            </div>
            <Link href="/blocks" className="text-xs link">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover/30">
                <tr>
                  <th className="table-header">Height</th>
                  <th className="table-header">Delegate</th>
                  <th className="table-header hidden sm:table-cell">Txs</th>
                  <th className="table-header text-right">Reward</th>
                  <th className="table-header text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr key={block.id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="table-cell">
                      <Link href={`/blocks/${block.id}`} className="link font-mono text-sm">
                        {block.height.toLocaleString()}
                      </Link>
                    </td>
                    <td className="table-cell">
                      <Link href={`/wallets/${block.generator.address}`} className="link text-sm">
                        {block.generator.username || truncateHash(block.generator.address)}
                      </Link>
                    </td>
                    <td className="table-cell hidden sm:table-cell text-sm text-secondary">
                      {block.transactions}
                    </td>
                    <td className="table-cell text-right text-sm font-mono">
                      {formatXQR(block.forged.reward)}
                    </td>
                    <td className="table-cell text-right text-sm text-secondary">
                      {timeAgo(block.timestamp.unix)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Transactions */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-primary" />
              <h3 className="text-base font-semibold">Latest Transactions</h3>
            </div>
            <Link href="/transactions" className="text-xs link">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover/30">
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header hidden sm:table-cell">Type</th>
                  <th className="table-header text-right">Amount</th>
                  <th className="table-header text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="table-cell">
                      <Link href={`/transactions/${tx.id}`} className="link font-mono text-sm">
                        {truncateHash(tx.id, 6, 6)}
                      </Link>
                    </td>
                    <td className="table-cell hidden sm:table-cell">
                      <span className={getTxTypeBadgeClass(tx.type, tx.typeGroup)}>{getTxTypeLabel(tx.type, tx.typeGroup)}</span>
                    </td>
                    <td className="table-cell text-right text-sm font-mono">
                      {formatXQR(tx.amount)} XQR
                    </td>
                    <td className="table-cell text-right text-sm text-secondary">
                      {timeAgo(tx.timestamp.unix)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
