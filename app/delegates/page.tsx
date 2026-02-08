import Link from "next/link";
import { getDelegates } from "@/lib/api";
import { formatXQRWhole, timeAgo } from "@/lib/utils";
import { Vote, CheckCircle, XCircle } from "lucide-react";

export const revalidate = 8;

export default async function DelegatesPage() {
  const [page1, page2] = await Promise.all([
    getDelegates(1, 100),
    getDelegates(2, 100),
  ]);
  const delegates = [...page1.data, ...page2.data];

  const nowUnix = Math.floor(Date.now() / 1000);
  const OFFLINE_THRESHOLD = 15 * 60; // 15 minutes in seconds

  const active = delegates.filter((d) => d.rank <= 51 && !d.isResigned);
  const standby = delegates.filter((d) => d.rank > 51 || d.isResigned);
  const onlineCount = active.filter((d) => d.blocks.last && (nowUnix - d.blocks.last.timestamp.unix) < OFFLINE_THRESHOLD).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <Vote className="w-6 h-6 text-primary" /> Delegates
        </h1>
        <p className="text-sm text-secondary mt-1">
          51 active forging delegates — {delegates.length} registered
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="stat-tile">
          <div className="stat-label">Active</div>
          <div className="stat-value text-success">{active.length}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Online</div>
          <div className="stat-value text-success">{onlineCount}/{active.length}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Offline</div>
          <div className="stat-value text-error">{active.length - onlineCount}/{active.length}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Standby</div>
          <div className="stat-value text-warning">{standby.filter((d) => !d.isResigned).length}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Resigned</div>
          <div className="stat-value text-error">{delegates.filter((d) => d.isResigned).length}</div>
        </div>
      </div>

      {/* Active Delegates */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <h3 className="text-base font-semibold">Active Delegates</h3>
          <span className="badge-success ml-auto">{active.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-hover/30">
              <tr>
                <th className="table-header w-16">Rank</th>
                <th className="table-header text-center w-16">Status</th>
                <th className="table-header">Username</th>
                <th className="table-header text-right hidden sm:table-cell">Votes</th>
                <th className="table-header text-right hidden md:table-cell">Approval</th>
                <th className="table-header text-right hidden md:table-cell">Blocks</th>
                <th className="table-header text-right hidden lg:table-cell">Total Forged</th>
                <th className="table-header text-right hidden sm:table-cell">Last Block</th>
              </tr>
            </thead>
            <tbody>
              {active.map((d) => {
                const isOnline = d.blocks.last && (nowUnix - d.blocks.last.timestamp.unix) < OFFLINE_THRESHOLD;
                return (
                <tr key={d.address} className="hover:bg-dark-hover/30 transition-colors">
                  <td className="table-cell font-mono text-sm text-center">
                    <span className="badge-primary">{d.rank}</span>
                  </td>
                  <td className="table-cell text-center">
                    {isOnline ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-success" title="Online — forged within 15 minutes">
                        <span className="status-dot-success" /> Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-error" title="Offline — no block in 15+ minutes">
                        <span className="status-dot-error" /> Offline
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <Link href={`/wallets/${d.address}`} className="link font-medium">
                      {d.username}
                    </Link>
                  </td>
                  <td className="table-cell text-right font-mono text-sm hidden sm:table-cell">
                    {formatXQRWhole(d.votes)}
                  </td>
                  <td className="table-cell text-right hidden md:table-cell">
                    <span className="text-sm">{d.production.approval.toFixed(2)}%</span>
                  </td>
                  <td className="table-cell text-right font-mono text-sm hidden md:table-cell">
                    {d.blocks.produced.toLocaleString()}
                  </td>
                  <td className="table-cell text-right font-mono text-sm hidden lg:table-cell">
                    {formatXQRWhole(d.forged.total)} XQR
                  </td>
                  <td className="table-cell text-right text-secondary text-sm hidden sm:table-cell">
                    {d.blocks.last ? timeAgo(d.blocks.last.timestamp.unix) : "—"}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standby */}
      {standby.length > 0 && (
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <XCircle className="w-4 h-4 text-muted" />
            <h3 className="text-base font-semibold">Standby &amp; Resigned</h3>
            <span className="badge-neutral ml-auto">{standby.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover/30">
                <tr>
                  <th className="table-header w-16">Rank</th>
                  <th className="table-header">Username</th>
                  <th className="table-header text-right hidden sm:table-cell">Votes</th>
                  <th className="table-header text-center hidden sm:table-cell">Status</th>
                  <th className="table-header text-right hidden md:table-cell">Blocks</th>
                </tr>
              </thead>
              <tbody>
                {standby.map((d) => (
                  <tr key={d.address} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="table-cell font-mono text-sm text-center text-muted">{d.rank}</td>
                    <td className="table-cell">
                      <Link href={`/wallets/${d.address}`} className="link">
                        {d.username}
                      </Link>
                    </td>
                    <td className="table-cell text-right font-mono text-sm text-secondary hidden sm:table-cell">
                      {formatXQRWhole(d.votes)}
                    </td>
                    <td className="table-cell text-center hidden sm:table-cell">
                      {d.isResigned ? (
                        <span className="badge-error">Resigned</span>
                      ) : (
                        <span className="badge-warning">Standby</span>
                      )}
                    </td>
                    <td className="table-cell text-right font-mono text-sm text-secondary hidden md:table-cell">
                      {d.blocks.produced.toLocaleString()}
                    </td>
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
