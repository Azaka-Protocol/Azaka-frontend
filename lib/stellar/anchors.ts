import axios from 'axios';
import { Asset, Server } from '@stellar/stellar-sdk';
import { getHorizonUrl } from './network';

export interface AnchorInfo {
  name: string;
  url: string;
  sep24Url: string;
  assetCode: string;
  assetIssuer: string;
}

// Known anchors for testnet
const TESTNET_ANCHORS: Record<string, AnchorInfo> = {
  USDC: {
    name: 'Circle',
    url: 'https://www.circle.com',
    sep24Url: 'https://testanchor.stellar.org',
    assetCode: 'USDC',
    assetIssuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
  },
  NGNC: {
    name: 'NGNC',
    url: 'https://ngnc.online',
    sep24Url: 'https://testanchor.stellar.org',
    assetCode: 'NGNC',
    assetIssuer: 'GDZST3XVCDTUJ76ZAV2HA72KYQODXXZ5PTMAPZGDHZ6CS7RO7MGG3DBM',
  },
};

export const getAnchorForAsset = (assetCode: string): AnchorInfo | null => {
  return TESTNET_ANCHORS[assetCode] || null;
};

export const initiateWithdrawal = async (
  assetCode: string,
  amount: string
): Promise<{ url: string; id: string }> => {
  const anchor = getAnchorForAsset(assetCode);
  
  if (!anchor) {
    throw new Error(`No anchor found for asset ${assetCode}`);
  }

  try {
    // In a real implementation, this would call the SEP-24 interactive flow
    // For now, we return a placeholder
    const response = await axios.post(`${anchor.sep24Url}/sep24/transactions/withdraw/interactive`, {
      asset_code: assetCode,
      amount,
    });

    return {
      url: response.data.url,
      id: response.data.id,
    };
  } catch (error) {
    console.error('Error initiating withdrawal:', error);
    throw new Error('Failed to initiate withdrawal. Please try again.');
  }
};

export const getExchangeRate = async (
  baseAsset: string,
  counterAsset: string = 'USD'
): Promise<number> => {
  try {
    const server = new Server(getHorizonUrl());
    
    // Get the orderbook for the asset pair
    const orderbook = await server
      .orderbook(
        new Asset(baseAsset, TESTNET_ANCHORS[baseAsset]?.assetIssuer || ''),
        Asset.native()
      )
      .call();

    // Calculate mid-price from best bid and ask
    if (orderbook.bids.length > 0 && orderbook.asks.length > 0) {
      const bestBid = parseFloat(orderbook.bids[0].price);
      const bestAsk = parseFloat(orderbook.asks[0].price);
      return (bestBid + bestAsk) / 2;
    }

    // Fallback rates for testnet
    const fallbackRates: Record<string, number> = {
      USDC: 1.0,
      NGNC: 0.0013, // ~750 NGN per USD
    };

    return fallbackRates[baseAsset] || 1.0;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Return fallback rates
    const fallbackRates: Record<string, number> = {
      USDC: 1.0,
      NGNC: 0.0013,
    };

    return fallbackRates[baseAsset] || 1.0;
  }
};

export const getUsdEquivalent = async (
  amount: number,
  assetCode: string
): Promise<number> => {
  if (assetCode === 'USDC') {
    return amount;
  }

  const rate = await getExchangeRate(assetCode);
  return amount * rate;
};
