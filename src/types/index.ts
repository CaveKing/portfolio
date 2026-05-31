/**
 * Domain models for พอร์ทหุ้น (Portfolio).
 * All timestamps are stored as epoch milliseconds (number) for easy sorting
 * and serialization. Firestore `Timestamp`s are converted at the data layer.
 */

export type Currency = "THB" | "USD";

export interface UserProfile {
  uid: string;
  username: string;
  /** Lowercased username, used for case-insensitive uniqueness + lookup. */
  usernameLower: string;
  email: string;
  /** Deterministic accent color for the avatar. */
  avatarColor?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Holding {
  id: string;
  symbol: string;
  name?: string;
  shares: number;
  averageCost: number;
  /** Manually maintained by the user (no external price feed). */
  currentPrice: number;
  currency: Currency;
  createdAt: number;
  updatedAt: number;
}

export type TransactionType = "buy" | "sell" | "deposit" | "withdraw";

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Required for buy/sell, omitted for deposit/withdraw. */
  symbol?: string;
  shares?: number;
  price?: number;
  /** Positive cash magnitude; direction is implied by `type`. */
  amount: number;
  currency: Currency;
  fee?: number;
  note?: string;
  /** When the transaction occurred (epoch ms). */
  date: number;
  createdAt: number;
}

export interface JournalNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface WatchItem {
  id: string;
  symbol: string;
  name?: string;
  targetPrice?: number;
  currency: Currency;
  note?: string;
  /** Lower = higher in the Top 5 list. */
  order: number;
  createdAt: number;
  updatedAt: number;
}

/** A holding enriched with derived market metrics. */
export interface HoldingWithMetrics extends Holding {
  marketValue: number;
  costBasis: number;
  profitLoss: number;
  profitLossPercent: number;
}

/** Per-currency portfolio totals (no FX conversion across currencies). */
export interface CurrencyTotals {
  currency: Currency;
  marketValue: number;
  costBasis: number;
  profitLoss: number;
  profitLossPercent: number;
  holdingsCount: number;
}

export type ChartType = "line" | "pie" | "dashboard";

export type Period = "daily" | "weekly" | "monthly" | "yearly";
