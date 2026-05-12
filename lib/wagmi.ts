// Wagmi config — used by the client-side <Providers> wrapper. Server-side
// page data still goes through viem's publicClient (lib/chain/client.ts);
// wagmi is reserved for components that need reactive chain state, wallet
// connection, or transactions (v0.2 territory).

import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { galileo } from "./chain/galileo";

export const wagmiConfig = createConfig({
  chains: [galileo],
  // v0.1 supports the injected provider only (MetaMask, Rabby, Coinbase
  // Wallet's injected bridge, etc.). WalletConnect / Coinbase SDK / Safe
  // are out of scope until v0.2 — they need projectIds / app metadata that
  // add hosting concerns the read-only dashboard doesn't justify yet.
  connectors: [injected()],
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
