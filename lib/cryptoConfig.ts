/**
 * Manual crypto payment configuration.
 *
 * Reads the store's RECEIVING wallet addresses from environment variables.
 * These are public addresses only — never put private keys / seed phrases here.
 * A wallet is only offered to customers when its address env var is set, so the
 * store owner controls which networks appear simply by filling in the env vars.
 */

export interface CryptoWallet {
  /** Stable id used as a React key / copy target. */
  id: string;
  /** Coin shown to the customer, e.g. "BTC" or "USDT". */
  coin: string;
  /** Network label, e.g. "Bitcoin", "TRC20 (Tron)", "ERC20 (Ethereum)". */
  network: string;
  /** The receiving wallet address. */
  address: string;
}

export interface CryptoConfig {
  wallets: CryptoWallet[];
  /** Optional support note shown on the instructions page. */
  supportNote: string;
  /** True when at least one wallet address is configured. */
  enabled: boolean;
}

/**
 * Builds the crypto config from env vars. Safe to call on the server only
 * (env vars are not exposed to the client). The public API route returns this.
 */
export function getCryptoConfig(): CryptoConfig {
  const wallets: CryptoWallet[] = [];

  const btc = process.env.CRYPTO_BTC_ADDRESS?.trim();
  const usdtTrc20 = process.env.CRYPTO_USDT_TRC20_ADDRESS?.trim();
  const usdtErc20 = process.env.CRYPTO_USDT_ERC20_ADDRESS?.trim();

  if (btc) {
    wallets.push({ id: 'btc', coin: 'BTC', network: 'Bitcoin', address: btc });
  }
  if (usdtTrc20) {
    wallets.push({ id: 'usdt-trc20', coin: 'USDT', network: 'TRC20 (Tron)', address: usdtTrc20 });
  }
  if (usdtErc20) {
    wallets.push({ id: 'usdt-erc20', coin: 'USDT', network: 'ERC20 (Ethereum)', address: usdtErc20 });
  }

  const supportNote =
    process.env.CRYPTO_SUPPORT_NOTE?.trim() ||
    'After sending the payment, contact support with your order reference and transaction hash. Your access details will be delivered after payment confirmation.';

  return {
    wallets,
    supportNote,
    enabled: wallets.length > 0,
  };
}
