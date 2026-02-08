import Link from "next/link";
import { getBlocks } from "@/lib/api";
import { formatXQR, timeAgo, truncateHash } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { Boxes } from "lucide-react";

export const revalidate = 8;

export default async function BlocksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const { data: blocks, meta } = await getBlocks(page, 25);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold flex items-center gap-2">
          <Boxes className="w-6 h-6 text-primary" /> Blocks
        </h1>
        <p className="text-sm text-secondary mt-1">
          {meta.totalCount.toLocaleString()} blocks total
        </p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-hover/30">
              <tr>
                <th className="table-header">Height</th>
                <th className="table-header">ID</th>
                <th className="table-header hidden md:table-cell">Delegate</th>
                <th className="table-header text-center">Txs</th>
                <th className="table-header text-right hidden sm:table-cell">Reward</th>
                <th className="table-header text-right hidden sm:table-cell">Fee</th>
                <th className="table-header text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id} className="hover:bg-dark-hover/30 transition-colors">
                  <td className="table-cell font-mono">
                    <Link href={`/blocks/${block.id}`} className="link">
                      {block.height.toLocaleString()}
                    </Link>
                  </td>
                  <td className="table-cell font-mono text-sm">
                    <Link href={`/blocks/${block.id}`} className="link">
                      {truncateHash(block.id, 8, 8)}
                    </Link>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <Link href={`/wallets/${block.generator.address}`} className="link text-sm">
                      {block.generator.username || truncateHash(block.generator.address)}
                    </Link>
                  </td>
                  <td className="table-cell text-center text-secondary">{block.transactions}</td>
                  <td className="table-cell text-right font-mono hidden sm:table-cell">
                    {formatXQR(block.forged.reward)}
                  </td>
                  <td className="table-cell text-right font-mono text-secondary hidden sm:table-cell">
                    {formatXQR(block.forged.fee)}
                  </td>
                  <td className="table-cell text-right text-secondary text-sm">
                    {timeAgo(block.timestamp.unix)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={Math.min(meta.pageCount, 400)} basePath="/blocks" />
    </div>
  );
}
