import { getPeers, getNodeStatus } from "@/lib/api";
import { Globe, CheckCircle, AlertTriangle } from "lucide-react";

export const revalidate = 30;

export default async function PeersPage() {
  const [{ data: peers, meta }, status] = await Promise.all([
    getPeers(1, 100),
    getNodeStatus(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" /> Peers
        </h1>
        <p className="text-sm text-secondary mt-1">
          {meta.totalCount} peers connected to the network
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-tile">
          <div className="stat-label">Total Peers</div>
          <div className="stat-value">{meta.totalCount}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Network Height</div>
          <div className="stat-value">{status.now.toLocaleString()}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Synced</div>
          <div className="stat-value flex items-center gap-2">
            <span className="status-dot-success" />
            {status.synced ? "Yes" : "No"}
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Node Version</div>
          <div className="stat-value text-base">
            {peers[0]?.version || "—"}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-hover/30">
              <tr>
                <th className="table-header">IP Address</th>
                <th className="table-header hidden sm:table-cell">Port</th>
                <th className="table-header hidden md:table-cell">Version</th>
                <th className="table-header text-right">Height</th>
                <th className="table-header text-right">Latency</th>
                <th className="table-header text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {peers.map((peer) => {
                const heightDiff = status.now - peer.height;
                const isSynced = heightDiff <= 5;
                return (
                  <tr key={peer.ip} className="hover:bg-dark-hover/30 transition-colors">
                    <td className="table-cell font-mono text-sm">{peer.ip}</td>
                    <td className="table-cell text-secondary hidden sm:table-cell">{peer.port}</td>
                    <td className="table-cell text-secondary hidden md:table-cell">{peer.version}</td>
                    <td className="table-cell text-right font-mono text-sm">
                      {peer.height.toLocaleString()}
                    </td>
                    <td className="table-cell text-right">
                      <span className={`text-sm ${peer.latency < 100 ? "text-success" : peer.latency < 500 ? "text-warning" : "text-error"}`}>
                        {peer.latency}ms
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      {isSynced ? (
                        <span className="inline-flex items-center gap-1 text-success text-xs">
                          <CheckCircle className="w-3.5 h-3.5" /> OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-warning text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" /> -{heightDiff}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
