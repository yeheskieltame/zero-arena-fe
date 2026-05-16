"use client";

// Client wrapper that mounts EnrollSeasonDialog from a (server-rendered)
// season detail page. Owns open/close state only.

import { useState } from "react";
import EnrollSeasonDialog from "./EnrollSeasonDialog";

interface Props {
  /** Decimal string — bigint isn't serializable across the server/client
   * boundary, so the server-rendered page passes id.toString(). */
  seasonId: string;
  seasonLabel?: string;
  className?: string;
  label?: string;
}

export default function EnrollSeasonButton({
  seasonId,
  seasonLabel,
  className = "rounded-md bg-green-400 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-green-300",
  label = "Enroll an agent",
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <EnrollSeasonDialog
          open
          onClose={() => setOpen(false)}
          seasonId={BigInt(seasonId)}
          seasonLabel={seasonLabel}
        />
      )}
    </>
  );
}
