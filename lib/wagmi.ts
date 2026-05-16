// Wagmi config — used by the client-side <Providers> wrapper. Server-side
// page data still goes through viem's publicClient (lib/chain/client.ts);
// wagmi is reserved for components that need reactive chain state, wallet
// connection, or transactions.
//
// Connectors come from RainbowKit's getDefaultConfig: injected wallets,
// Coinbase Wallet, and WalletConnect. WalletConnect requires a project ID
// from cloud.walletconnect.com — read from NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.
// Placeholder is accepted at build time; only WC-based wallets fail to
// connect when it's unset (injected wallets still work).

import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { galileo } from "./chain/galileo";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ||
  "YOUR_WALLETCONNECT_PROJECT_ID";

export const wagmiConfig = getDefaultConfig({
  appName: "Zero Arena",
  projectId,
  chains: [galileo],
  transports: {
    [galileo.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
