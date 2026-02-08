const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://78.47.141.58:5103/api/v2";

interface PaginatedResponse<T> {
  meta: {
    count: number;
    pageCount: number;
    totalCount: number;
    next: string | null;
    previous: string | null;
    self: string;
    first: string;
    last: string;
    totalCountIsEstimate?: boolean;
  };
  data: T[];
}

interface SingleResponse<T> {
  data: T;
}

export interface Block {
  id: string;
  version: number;
  height: number;
  previous: string;
  forged: {
    reward: string;
    fee: string;
    total: string;
    amount: string;
  };
  payload: {
    hash: string;
    length: number;
  };
  generator: {
    username: string;
    address: string;
    publicKey: string;
  };
  signature: string;
  confirmations: number;
  transactions: number;
  timestamp: {
    epoch: number;
    unix: number;
    human: string;
  };
}

export interface Transaction {
  id: string;
  blockId: string;
  version: number;
  type: number;
  typeGroup: number;
  amount: string;
  fee: string;
  sender: string;
  senderPublicKey: string;
  recipient: string;
  signature: string;
  vendorField?: string;
  confirmations: number;
  timestamp: {
    epoch: number;
    unix: number;
    human: string;
  };
  nonce: string;
  asset?: Record<string, unknown>;
}

export interface Wallet {
  address: string;
  publicKey: string;
  nonce: string;
  balance: string;
  attributes: Record<string, unknown>;
  isDelegate: boolean;
  isResigned: boolean;
  vote?: string;
  username?: string;
}

export interface Delegate {
  username: string;
  address: string;
  publicKey: string;
  votes: string;
  rank: number;
  isResigned: boolean;
  blocks: {
    produced: number;
    last: {
      id: string;
      height: number;
      timestamp: {
        epoch: number;
        unix: number;
        human: string;
      };
    };
  };
  production: {
    approval: number;
  };
  forged: {
    fees: string;
    rewards: string;
    total: string;
  };
}

export interface Peer {
  ip: string;
  port: number;
  ports: Record<string, number>;
  version: string;
  height: number;
  latency: number;
}

export interface BlockchainInfo {
  block: {
    height: number;
    id: string;
  };
  supply: string;
}

export interface NodeStatus {
  synced: boolean;
  now: number;
  blocksCount: number;
  timestamp: number;
}

async function apiFetch<T>(path: string, revalidate = 8): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getBlockchain(): Promise<BlockchainInfo> {
  const res = await apiFetch<SingleResponse<BlockchainInfo>>("/blockchain");
  return res.data;
}

export async function getNodeStatus(): Promise<NodeStatus> {
  const res = await apiFetch<SingleResponse<NodeStatus>>("/node/status");
  return res.data;
}

export async function getBlocks(page = 1, limit = 25) {
  return apiFetch<PaginatedResponse<Block>>(`/blocks?limit=${limit}&page=${page}`);
}

export async function getBlock(id: string) {
  return apiFetch<SingleResponse<Block>>(`/blocks/${id}`);
}

export async function getBlockTransactions(id: string, page = 1, limit = 25) {
  return apiFetch<PaginatedResponse<Transaction>>(`/blocks/${id}/transactions?limit=${limit}&page=${page}`);
}

export async function getTransactions(page = 1, limit = 25) {
  return apiFetch<PaginatedResponse<Transaction>>(`/transactions?limit=${limit}&page=${page}`);
}

export async function getTransaction(id: string) {
  return apiFetch<SingleResponse<Transaction>>(`/transactions/${id}`);
}

export async function getWallets(page = 1, limit = 25) {
  return apiFetch<PaginatedResponse<Wallet>>(`/wallets?limit=${limit}&orderBy=balance:desc&page=${page}`);
}

export async function getWallet(address: string) {
  return apiFetch<SingleResponse<Wallet>>(`/wallets/${address}`);
}

export async function getWalletTransactions(address: string, page = 1, limit = 25) {
  return apiFetch<PaginatedResponse<Transaction>>(`/wallets/${address}/transactions?limit=${limit}&page=${page}`);
}

export async function getDelegates(page = 1, limit = 51) {
  return apiFetch<PaginatedResponse<Delegate>>(`/delegates?limit=${limit}&page=${page}`);
}

export async function getPeers(page = 1, limit = 50) {
  return apiFetch<PaginatedResponse<Peer>>(`/peers?limit=${limit}&page=${page}`);
}

export async function search(query: string) {
  const q = query.trim();
  if (!q) return null;

  // Block height (numeric)
  if (/^\d+$/.test(q)) {
    try {
      const blocks = await apiFetch<PaginatedResponse<Block>>(`/blocks?height=${q}&limit=1`);
      if (blocks.data.length > 0) return { type: "block" as const, id: blocks.data[0].id };
    } catch { /* continue */ }
  }

  // Wallet address (starts with X, 34 chars)
  if (/^X[A-Za-z0-9]{33}$/.test(q)) {
    try {
      await apiFetch<SingleResponse<Wallet>>(`/wallets/${q}`);
      return { type: "wallet" as const, id: q };
    } catch { /* continue */ }
  }

  // Transaction or block ID (64 char hex)
  if (/^[a-f0-9]{64}$/i.test(q)) {
    try {
      await apiFetch<SingleResponse<Transaction>>(`/transactions/${q}`);
      return { type: "transaction" as const, id: q };
    } catch { /* try block */ }
    try {
      await apiFetch<SingleResponse<Block>>(`/blocks/${q}`);
      return { type: "block" as const, id: q };
    } catch { /* not found */ }
  }

  // Delegate username
  try {
    const res = await apiFetch<SingleResponse<Delegate>>(`/delegates/${q}`);
    if (res.data) return { type: "wallet" as const, id: res.data.address };
  } catch { /* not found */ }

  return null;
}
