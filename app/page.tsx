import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Trade finance for African exporters.
            <span className="block text-brand mt-2">On-chain, instant, borderless.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Azaka brings letter of credit trade finance to the blockchain. Secure escrow, 
            automated document verification, and instant settlement on Stellar.
          </p>
          <Link
            href="/connect"
            className="inline-block px-8 py-4 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium text-lg"
          >
            Connect Wallet and Start Trading
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">1</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Create Trade</h3>
              <p className="text-text-secondary">
                Exporter creates a trade with required documents and selects issuing bank. 
                Importer deposits funds into smart contract escrow.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">2</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Submit Documents</h3>
              <p className="text-text-secondary">
                Freight forwarders and inspectors submit trade documents. 
                SHA-256 hashes stored on-chain, files on IPFS.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand">3</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Get Paid</h3>
              <p className="text-text-secondary">
                Once all documents are verified, escrow automatically releases payment 
                to exporter. Instant settlement, no intermediaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-brand-light py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-1">24h</div>
              <div className="text-sm text-text-secondary">Avg Settlement Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-1">$2.5M</div>
              <div className="text-sm text-text-secondary">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-1">127</div>
              <div className="text-sm text-text-secondary">Active Trades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand mb-1">15</div>
              <div className="text-sm text-text-secondary">Partner Banks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-text-primary">Azaka</span>
            </div>
            
            <div className="flex gap-6 text-sm text-text-secondary">
              <a href="https://docs.azaka.finance" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Documentation
              </a>
              <a href="https://github.com/azaka-finance" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                GitHub
              </a>
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                Stellar
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-text-muted">
            © 2024 Azaka. Built on Stellar. Open source under MIT License.
          </div>
        </div>
      </footer>
    </div>
  );
}
