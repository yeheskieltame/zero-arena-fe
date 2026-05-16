"use client";

// Client wrapper around <MintINftDialog/> so the (server-rendered) agent
// detail page can mount the modal trigger without becoming a client
// component itself. Owns the open/close state only — all wallet + tx
// logic lives in the dialog.

import { useState } from "react";
import MintINftDialog from "./MintINftDialog";
import type { Address } from "@/lib/be/transfer-oracle";

interface Props {
  tokenId: number;
  currentOwner: string;
  agentName?: string;
  className?: string;
  label?: string;
}

export default function MintINftButton({
  tokenId,
  currentOwner,
  agentName,
  className = "rounded-lg bg-green-400 py-2 text-sm font-semibold text-zinc-900 hover:bg-green-300",
  label = "Mint iNFT",
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <MintINftDialog
          open
          onClose={() => setOpen(false)}
          tokenId={BigInt(tokenId)}
          currentOwner={currentOwner as Address}
          agentName={agentName}
        />
      )}
    </>
  );
}
