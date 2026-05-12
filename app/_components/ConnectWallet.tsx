"use client";

// Minimal wallet button — injected connector only (MetaMask / Rabby /
// Coinbase Wallet via injection). Renders three states:
//
//   • Disconnected         → yellow "Connect Wallet" pill
//   • Connected, Galileo   → "● Galileo · 0x1234…5678" with dropdown
//   • Connected, wrong net → "● Wrong network · 0x…" with one-click switch
//
// We do NOT wire mint / clone / faucet from here yet. Those are v0.2
// territory; the dashboard is read-only per CLAUDE.md 16. The button
// exists to (a) preview the network awareness path, (b) give a third-party
// verifier the obvious next step for re-encryption transfers.

import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { galileo } from "@/lib/chain/galileo";

function truncate(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  if (!isConnected || !address) {
    return (
      <button
        onClick={() => connect({ connector: injected() })}
        disabled={isPending}
        className="ml-auto rounded-md bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-yellow-300 disabled:opacity-60"
      >
        {isPending ? "Connecting…" : "Connect Wallet"}
      </button>
    );
  }

  const wrongNetwork = chainId !== galileo.id;

  return (
    <div className="relative ml-auto" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs transition hover:border-zinc-700"
      >
        {wrongNetwork ? (
          <span className="inline-flex items-center gap-1.5 text-rose-300">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Wrong network
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Galileo
          </span>
        )}
        <span className="font-mono text-zinc-200">{truncate(address)}</span>
        <svg
          className={`size-3 text-zinc-500 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-xl">
          {wrongNetwork && (
            <button
              onClick={() => {
                switchChain({ chainId: galileo.id });
                setOpen(false);
              }}
              disabled={isSwitching}
              className="block w-full px-3 py-2.5 text-left text-xs text-yellow-300 hover:bg-zinc-900 disabled:opacity-60"
            >
              {isSwitching ? "Switching…" : "Switch to Galileo"}
            </button>
          )}
          <a
            href={`${galileo.blockExplorers.default.url}/address/${address}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 text-xs text-zinc-200 hover:bg-zinc-900"
          >
            View on Explorer ↗
          </a>
          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="block w-full border-t border-zinc-800 px-3 py-2.5 text-left text-xs text-rose-400 hover:bg-zinc-900"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
