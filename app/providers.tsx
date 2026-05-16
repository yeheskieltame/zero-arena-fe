"use client";

// Client-side providers for wagmi + react-query + RainbowKit. Mounted once
// in layout.tsx so client components anywhere in the tree can call
// useReadContract, useAccount, useConnectModal, etc. Server components
// keep using viem's publicClient directly (see lib/chain/readers.ts) —
// no provider needed for them.

import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/wagmi";

// Match the dashboard's zinc-900 surface + green-400 accent.
const rkTheme = darkTheme({
  accentColor: "#34d399",
  accentColorForeground: "#18181b",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
});

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rkTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
