import type {
  ChartType,
  Currency,
  Period,
  TransactionType,
} from "@/types";

export const APP_NAME = "พอร์ทหุ้น";
export const APP_NAME_EN = "Portfolio";
export const APP_TAGLINE = "ดูพอร์ตและติดตามการลงทุนอย่างเรียบหรู";

export const MAX_TOP5 = 5;

export const DEFAULT_CURRENCY: Currency = "THB";
export const CURRENCIES: Currency[] = ["THB", "USD"];

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  portfolio: "/portfolio",
  market: "/market",
  profile: "/profile",
} as const;

/** Routes that require an authenticated session. */
export const PROTECTED_ROUTES: string[] = [
  ROUTES.dashboard,
  ROUTES.portfolio,
  ROUTES.market,
  ROUTES.profile,
];

export const TRANSACTION_TYPES: {
  value: TransactionType;
  label: string;
  /** Sign of the cash impact for display. */
  direction: "in" | "out";
}[] = [
  { value: "buy", label: "ซื้อ", direction: "out" },
  { value: "sell", label: "ขาย", direction: "in" },
  { value: "deposit", label: "ฝากเงิน", direction: "in" },
  { value: "withdraw", label: "ถอนเงิน", direction: "out" },
];

export const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "line", label: "เส้น" },
  { value: "pie", label: "วงกลม" },
  { value: "dashboard", label: "แดชบอร์ด" },
];

export const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "วัน" },
  { value: "weekly", label: "สัปดาห์" },
  { value: "monthly", label: "เดือน" },
  { value: "yearly", label: "ปี" },
];

/** Apple-system-style palette used to color avatars and chart slices. */
export const ACCENT_COLORS = [
  "#0071e3",
  "#5e5ce6",
  "#bf5af2",
  "#ff375f",
  "#ff9f0a",
  "#34c759",
  "#30b0c7",
  "#ac8e68",
];

export const CHART_PALETTE = [
  "#0071e3",
  "#34c759",
  "#5e5ce6",
  "#ff9f0a",
  "#ff375f",
  "#30b0c7",
  "#bf5af2",
  "#ac8e68",
  "#64d2ff",
  "#ffd60a",
];
