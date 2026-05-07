# Contributing to Azaka Web

Thank you for your interest in contributing to Azaka Web! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 8+
- Freighter wallet browser extension
- Git

### Local Development

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/azaka-web.git
cd azaka-web
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in your local configuration in `.env.local`.

4. **Run the development server**

```bash
pnpm dev
```

### Pointing to Local Soroban Node

To develop against a local Soroban node:

1. **Start your local Stellar node**

```bash
stellar network start local
```

2. **Update your `.env.local`**

```env
NEXT_PUBLIC_STELLAR_NETWORK=standalone
NEXT_PUBLIC_HORIZON_URL=http://localhost:8000
NEXT_PUBLIC_SOROBAN_RPC_URL=http://localhost:8000/soroban/rpc
```

3. **Deploy contracts locally**

Follow the instructions in the [Azaka contracts repository](https://github.com/azaka-finance/azaka-contracts) to deploy contracts to your local node.

4. **Update contract IDs in `.env.local`**

## Code Standards

### TypeScript

- **No `any` types** - Use proper typing throughout
- **Strict mode enabled** - All TypeScript strict checks must pass
- **Explicit return types** - Add return types to all functions

### React

- **Functional components only** - No class components
- **Hooks for state** - Use React hooks and custom hooks
- **Client components** - Mark client components with `'use client'`

### Styling

- **Tailwind CSS** - Use Tailwind utility classes
- **CSS variables** - Use design tokens from `globals.css`
- **Responsive design** - Mobile-first approach
- **Dark mode** - Support both light and dark themes

### File Organization

- **Colocation** - Keep related files together
- **Named exports** - Prefer named exports over default exports for components
- **Index files** - Avoid index files, use explicit imports

## Pull Request Process

### Before Submitting

Run the following checks locally:

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Tests
pnpm test

# Build
pnpm build
```

All checks must pass before submitting a PR.

### PR Checklist

- [ ] Types pass (`pnpm type-check`)
- [ ] Lint clean (`pnpm lint`)
- [ ] No `console.log` statements (use proper logging)
- [ ] Responsive on mobile (test on small screens)
- [ ] Dark mode works (test with system dark mode)
- [ ] Error states handled (show user-friendly messages)
- [ ] Loading states implemented (no layout shift)
- [ ] Accessibility considered (semantic HTML, ARIA labels)

### PR Title Format

Use conventional commit format:

- `feat: Add trade cancellation feature`
- `fix: Resolve escrow release button state`
- `docs: Update README with deployment instructions`
- `style: Improve mobile layout for trade cards`
- `refactor: Extract document upload logic to hook`
- `test: Add tests for CreateTradeForm`

### PR Description

Include:

1. **What**: Brief description of changes
2. **Why**: Motivation and context
3. **How**: Implementation approach
4. **Testing**: What you tested and how
5. **Screenshots**: For UI changes

## Issue Labels

- `good first issue` - Good for newcomers
- `dashboard` - Dashboard-related changes
- `components` - Component updates
- `wallet` - Wallet integration
- `design` - Design and styling
- `bug` - Bug fixes
- `enhancement` - New features
- `documentation` - Documentation updates

## Testing Guidelines

### Unit Tests

- Test business logic and utility functions
- Mock external dependencies (Stellar SDK, IPFS)
- Use React Testing Library for component tests

### E2E Tests

- Test critical user flows
- Use Playwright for browser automation
- Test on multiple viewports (mobile, tablet, desktop)

### Manual Testing

Before submitting a PR, manually test:

1. **Wallet connection** - Connect and disconnect Freighter
2. **Role switching** - Test each role's dashboard
3. **Trade creation** - Create a trade end-to-end
4. **Document upload** - Upload and verify documents
5. **Escrow operations** - Deposit and release escrow
6. **Responsive design** - Test on mobile and desktop
7. **Dark mode** - Toggle system dark mode

## Code Review Process

1. **Automated checks** - CI must pass
2. **Peer review** - At least one approval required
3. **Maintainer review** - Final review by maintainer
4. **Merge** - Squash and merge to main

## Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/azaka)
- **GitHub Discussions**: Ask questions in [Discussions](https://github.com/azaka-finance/azaka-web/discussions)
- **Issues**: Report bugs in [Issues](https://github.com/azaka-finance/azaka-web/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
