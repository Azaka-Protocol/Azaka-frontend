# Azaka Web

Official frontend for the Azaka decentralised trade finance protocol on Stellar. A production-grade Next.js dApp with role-based dashboards for exporters, importers, banks, and freight forwarders/inspectors.

![Azaka Web](./public/assets/screenshot-placeholder.png)

## Overview

Azaka brings letter of credit trade finance to the blockchain. Secure escrow, automated document verification, and instant settlement on Stellar. Built for African exporters to access global trade finance without traditional banking intermediaries.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Blockchain | Stellar (Soroban smart contracts) |
| Wallet | Freighter |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Forms | Zod validation |
| Storage | IPFS (Pinata) |
| Testing | Vitest + React Testing Library |
| E2E Testing | Playwright |

## Features

- **Role-Based Dashboards**: Separate interfaces for exporters, importers, banks, and freight forwarders
- **Smart Contract Escrow**: Automated payment release based on document verification
- **Document Verification**: SHA-256 hashing in-browser before IPFS upload
- **Real-Time Updates**: Polling-based trade status updates
- **Responsive Design**: Mobile-first layout optimized for field use
- **Dark Mode**: Automatic dark mode support
- **Type-Safe**: Strict TypeScript throughout

## Prerequisites

- Node.js 20 or higher
- pnpm 8 or higher
- Freighter wallet browser extension ([Install here](https://freighter.app))

## Quickstart

1. **Clone the repository**

```bash
git clone https://github.com/azaka-finance/azaka-web.git
cd azaka-web
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_TRADE_CONTRACT_ID=<your-trade-contract-id>
NEXT_PUBLIC_ESCROW_CONTRACT_ID=<your-escrow-contract-id>
NEXT_PUBLIC_DOCUMENT_CONTRACT_ID=<your-document-contract-id>
NEXT_PUBLIC_REGISTRY_CONTRACT_ID=<your-registry-contract-id>
NEXT_PUBLIC_PINATA_API_KEY=<your-pinata-api-key>
NEXT_PUBLIC_PINATA_SECRET_KEY=<your-pinata-secret-key>
```

4. **Run development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Role Guide

### Exporter
- Create new trades with document requirements
- Track payment status and document verification
- Receive automatic payment release when all documents verified

### Importer
- View trades where you are the importer
- Deposit escrow funds to activate trades
- Request refunds for expired trades

### Bank (Issuing/Confirming)
- Issue letters of credit for trades
- Confirm LCs as a second bank
- View trade book and pending confirmations

### Freight Forwarder / Inspector
- Submit required trade documents
- Upload files with automatic SHA-256 hashing
- Track document verification status

## Connecting to Azaka Contracts

The Azaka smart contracts are deployed on Stellar Testnet. To connect:

1. Get contract IDs from the [Azaka smart contract repository](https://github.com/azaka-finance/azaka-contracts)
2. Add them to your `.env.local` file
3. Ensure your Freighter wallet is connected to Stellar Testnet
4. Fund your testnet account using the [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

## Project Structure

```
azaka-web/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   └── trade/             # Trade pages
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── shared/           # Shared components
│   └── trade/            # Trade-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── azaka/           # Azaka SDK wrapper
│   ├── stellar/         # Stellar/Freighter integration
│   └── utils/           # Helper functions
├── store/               # Zustand stores
└── styles/              # Global styles
```

## Development

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

### Building

```bash
pnpm build
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and how to submit pull requests.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Links

- [Documentation](https://docs.azaka.finance)
- [Smart Contracts](https://github.com/azaka-finance/azaka-contracts)
- [Stellar](https://stellar.org)
- [Freighter Wallet](https://freighter.app)

---

Built with ❤️ for African exporters on Stellar
