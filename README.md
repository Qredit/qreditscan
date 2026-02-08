# QreditScan

A fast, modern block explorer for the [Qredit](https://qredit.io) blockchain.

![QreditScan](public/logo.png)

## Features

- **Dashboard** — Real-time blockchain stats, latest blocks, and latest transactions
- **Block Explorer** — Browse all blocks with details, included transactions, delegate info
- **Transaction Explorer** — View all transactions with type, sender, recipient, amount, vendor field
- **Top Wallets** — Ranked wallet list by balance with delegation status
- **Delegates** — All 51 active forging delegates plus standby/resigned, with vote counts, approval %, blocks produced, and total forged
- **Peers** — Live network peer list with version, height, latency, and sync status
- **Search** — Search by block height, block/transaction ID, wallet address, or delegate username

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/qredit/qreditscan.git
cd qreditscan

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

The app builds to a standalone output — deploy anywhere that runs Node.js.

### PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "qreditscan" -- start

# Or with a custom port / API URL
PORT=8080 NEXT_PUBLIC_API_URL=http://your-node:5103/api/v2 pm2 start npm --name "qreditscan" -- start

# Useful PM2 commands
pm2 status              # Check status
pm2 logs qreditscan     # View logs
pm2 restart qreditscan  # Restart
pm2 stop qreditscan     # Stop
pm2 delete qreditscan   # Remove

# Auto-start on server reboot
pm2 startup
pm2 save
```

### Docker (Optional)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://78.47.141.58:5103/api/v2` | Qredit node API endpoint |
| `PORT` | `3000` | Server port |

To use your own Qredit node, set `NEXT_PUBLIC_API_URL` to your node's API URL:

```bash
NEXT_PUBLIC_API_URL=http://your-node-ip:5103/api/v2 npm run dev
```

## Tech Stack

- **[Next.js 15](https://nextjs.org/)** — React framework with App Router and Server Components
- **[React 19](https://react.dev/)** — UI library
- **[TailwindCSS 4](https://tailwindcss.com/)** — Utility-first CSS
- **[Lucide](https://lucide.dev/)** — Icon library
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety

## Architecture

- Server Components for all data fetching — zero client-side API calls for page loads
- ISR (Incremental Static Regeneration) with 8-second revalidation for blocks/transactions
- Client components only for interactive elements (search, copy buttons, mobile menu)
- Standalone output for minimal Docker images

## API Reference

QreditScan uses the standard ARK v2 API. Key endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/v2/blockchain` | Chain info (height, supply) |
| `GET /api/v2/blocks?limit=N&page=N` | Paginated blocks |
| `GET /api/v2/blocks/{id}` | Single block |
| `GET /api/v2/transactions?limit=N&page=N` | Paginated transactions |
| `GET /api/v2/transactions/{id}` | Single transaction |
| `GET /api/v2/wallets?orderBy=balance:desc` | Top wallets |
| `GET /api/v2/wallets/{address}` | Single wallet |
| `GET /api/v2/wallets/{address}/transactions` | Wallet transactions |
| `GET /api/v2/delegates` | All delegates |
| `GET /api/v2/peers` | Network peers |
| `GET /api/v2/node/status` | Node sync status |
| `GET /api/v2/node/configuration` | Node configuration |

## License

MIT
