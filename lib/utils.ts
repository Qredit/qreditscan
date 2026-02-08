/**
 * Format a satoshi value (string) to a human-readable XQR amount.
 * 1 XQR = 100,000,000 satoshi (8 decimals).
 */
export function formatXQR(satoshi: string): string {
  const val = BigInt(satoshi);
  const whole = val / BigInt(1e8);
  const frac = val % BigInt(1e8);
  if (frac === BigInt(0)) return whole.toLocaleString();
  const fracStr = frac.toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole.toLocaleString()}.${fracStr}`;
}

/**
 * Format a Unix timestamp to a relative time string.
 */
export function timeAgo(unix: number): string {
  const seconds = Math.floor(Date.now() / 1000) - unix;
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/**
 * Format a Unix timestamp to a date string.
 */
export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Truncate a hash/address for display.
 */
export function truncateHash(hash: string, start = 8, end = 8): string {
  if (hash.length <= start + end + 3) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

/**
 * Get transaction type label from type number.
 */
export function getTxTypeLabel(type: number, typeGroup: number): string {
  if (typeGroup === 1) {
    switch (type) {
      case 0: return "Transfer";
      case 1: return "Second Signature";
      case 2: return "Delegate Registration";
      case 3: return "Vote";
      case 4: return "Multi Signature";
      case 5: return "IPFS";
      case 6: return "Multi Payment";
      case 7: return "Delegate Resignation";
      case 8: return "HTLC Lock";
      case 9: return "HTLC Claim";
      case 10: return "HTLC Refund";
    }
  }
  return `Type ${type}`;
}

/**
 * Format supply string to human-readable XQR.
 */
export function formatSupply(satoshi: string): string {
  const val = Number(BigInt(satoshi) / BigInt(1e8));
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
  return val.toLocaleString();
}
