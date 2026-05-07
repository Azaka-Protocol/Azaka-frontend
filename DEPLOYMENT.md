# Deployment Guide

This guide covers deploying Azaka Web to production.

## Vercel Deployment (Recommended)

### Prerequisites

- Vercel account ([sign up here](https://vercel.com))
- GitHub repository connected to Vercel
- Environment variables configured

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `azaka-web` repository

### Step 2: Configure Build Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Node Version**: 20.x

### Step 3: Set Environment Variables

Add these environment variables in Vercel dashboard:

```env
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_HORIZON_URL=https://horizon.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-rpc.mainnet.stellar.gateway.fm
NEXT_PUBLIC_TRADE_CONTRACT_ID=<mainnet-trade-contract-id>
NEXT_PUBLIC_ESCROW_CONTRACT_ID=<mainnet-escrow-contract-id>
NEXT_PUBLIC_DOCUMENT_CONTRACT_ID=<mainnet-document-contract-id>
NEXT_PUBLIC_REGISTRY_CONTRACT_ID=<mainnet-registry-contract-id>
NEXT_PUBLIC_PINATA_API_KEY=<your-pinata-api-key>
NEXT_PUBLIC_PINATA_SECRET_KEY=<your-pinata-secret-key>
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL

### Step 5: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

## Manual Deployment

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

The app will be available at `http://localhost:3000`.

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start app with PM2
pm2 start npm --name "azaka-web" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

## Docker Deployment

### Dockerfile

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install -g pnpm
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t azaka-web .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_STELLAR_NETWORK=mainnet \
  -e NEXT_PUBLIC_HORIZON_URL=https://horizon.stellar.org \
  -e NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-rpc.mainnet.stellar.gateway.fm \
  -e NEXT_PUBLIC_TRADE_CONTRACT_ID=<contract-id> \
  -e NEXT_PUBLIC_ESCROW_CONTRACT_ID=<contract-id> \
  -e NEXT_PUBLIC_DOCUMENT_CONTRACT_ID=<contract-id> \
  -e NEXT_PUBLIC_REGISTRY_CONTRACT_ID=<contract-id> \
  -e NEXT_PUBLIC_PINATA_API_KEY=<api-key> \
  -e NEXT_PUBLIC_PINATA_SECRET_KEY=<secret-key> \
  azaka-web
```

## Environment-Specific Configuration

### Testnet

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

### Mainnet

```env
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_HORIZON_URL=https://horizon.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-rpc.mainnet.stellar.gateway.fm
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test wallet connection with Freighter
- [ ] Create a test trade end-to-end
- [ ] Upload a test document
- [ ] Verify IPFS uploads work
- [ ] Test on mobile devices
- [ ] Check dark mode works
- [ ] Verify all contract interactions
- [ ] Test error handling
- [ ] Monitor performance metrics
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (optional)

## Monitoring

### Vercel Analytics

Enable Vercel Analytics in your project settings for:
- Page views
- Performance metrics
- Web Vitals
- User geography

### Error Tracking

Consider integrating Sentry:

```bash
pnpm add @sentry/nextjs
```

Configure in `next.config.ts`:

```typescript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: 'azaka',
    project: 'azaka-web',
  }
);
```

## Performance Optimization

### Image Optimization

- Use `next/image` for all images
- Serve images in WebP/AVIF format
- Implement lazy loading

### Code Splitting

- Dynamic imports for heavy components
- Route-based code splitting (automatic with Next.js)

### Caching

- Configure CDN caching headers
- Use React Query cache effectively
- Implement service worker (optional)

## Security

### Environment Variables

- Never commit `.env.local` to git
- Use Vercel's environment variable encryption
- Rotate API keys regularly

### Content Security Policy

Add CSP headers in `next.config.ts`:

```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://horizon-testnet.stellar.org https://soroban-testnet.stellar.org https://api.pinata.cloud;",
  },
];
```

### Rate Limiting

Consider implementing rate limiting for API routes to prevent abuse.

## Rollback Strategy

### Vercel

1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Manual

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout specific commit
git checkout <commit-hash>
git push origin main --force
```

## Troubleshooting

### Build Fails

- Check Node version (must be 20+)
- Verify all environment variables are set
- Clear `.next` cache: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && pnpm install`

### Runtime Errors

- Check browser console for errors
- Verify contract IDs are correct
- Ensure Freighter is installed and connected
- Check network connectivity to Stellar

### Performance Issues

- Enable Vercel Analytics
- Check bundle size: `pnpm build && pnpm analyze`
- Optimize images and fonts
- Review React Query cache settings

## Support

For deployment issues:
- Check [Vercel documentation](https://vercel.com/docs)
- Open an issue on [GitHub](https://github.com/azaka-finance/azaka-web/issues)
- Contact support@azaka.finance

---

Happy deploying! 🚀
