"use client";

// Client wrapper for DelegateAgentDialog so server-rendered pages can
// trigger it. Owns open/close state only.

import { useState } from "react";
import DelegateAgentDialog from "./DelegateAgentDialog";
import type { Address, Hex } from "@/lib/be/onboard";

interface Props {
  tokenId: number;
  currentOwner: string;
  /** AgentCertificate runHash for the cert this iNFT was minted from. */
  genesisHash: string;
  agentName?: string;
  defaultSymbol?: string;
  defaultInterval?: string;
  defaultMarket?: "spot" | "perp";
  className?: string;
  label?: string;
}

export default function DelegateAgentButton({
  tokenId,
  currentOwner,
  genesisHash,
  agentName,
  defaultSymbol,
  defaultInterval,
  defaultMarket,
  className = "rounded-lg border border-zinc-700 bg-zinc-900 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-600",
  label = "Manage Delegation",
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <DelegateAgentDialog
          open
          onClose={() => setOpen(false)}
          tokenId={BigInt(tokenId)}
          currentOwner={currentOwner as Address}
          genesisHash={genesisHash as Hex}
          agentName={agentName}
          defaultSymbol={defaultSymbol}
          defaultInterval={defaultInterval}
          defaultMarket={defaultMarket}
        />
      )}
    </>
  );
}
