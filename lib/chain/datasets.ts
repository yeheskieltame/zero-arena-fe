// Static snapshot of the canonical 0G datasets, mirrored from
// zero-arena-sdk/src/datasets.ts. Kept here so the FE doesn't need an npm
// dep on `zeroarena` (per CLAUDE.md 16 — FE should not pull SDK into the
// browser bundle). When zeroarena ships on npm we can swap this for the
// direct import.
//
// Bump this file in lockstep with the SDK's datasets.ts whenever the
// workspace operator re-uploads via `bacend dataset upload`.

export interface CanonicalDataset {
  rootHash: `0x${string}`;
  datasetHash: `0x${string}`;
  symbol: string;
  interval: string;
  market: "spot" | "perp";
  source: string;
  startTs: number;
  endTs: number;
  candleCount: number;
  uploadedAt: string;
}

export const CANONICAL_DATASETS: Record<string, CanonicalDataset> = {
  "BTCUSDT-15m-spot": {
    rootHash:
      "0x81a17c8b291b6bf77de03d6042cec83a517958dae5092025ee6b49ddcae962ff",
    datasetHash:
      "0x19b099f5ef0ceeb9b2d2c00aa339110f44c068f4dd9b1976db04b9733f4d6107",
    symbol: "BTCUSDT",
    interval: "15m",
    market: "spot",
    source: "binance",
    startTs: 1775952000000,
    endTs: 1778557500000,
    candleCount: 2896,
    uploadedAt: "2026-05-16T11:58:00.000Z",
  },
};

/** Look up a dataset entry by its keccak256 hash. Returns undefined if unknown. */
export function findDataset(datasetHash: string): CanonicalDataset | undefined {
  const lower = datasetHash.toLowerCase();
  for (const entry of Object.values(CANONICAL_DATASETS)) {
    if (entry.datasetHash.toLowerCase() === lower) return entry;
  }
  return undefined;
}

/** Human-readable window (e.g. "Apr 24 → May 12, 2026"). */
export function formatWindow(d: CanonicalDataset): string {
  const fmt = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(d.startTs)} → ${fmt(d.endTs)}`;
}
