import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
  getInitials,
  toDateInputValue,
} from "./format";

describe("formatCurrency", () => {
  it("formats USD with a dollar sign", () => {
    expect(formatCurrency(1000, "USD")).toBe("$1,000.00");
  });
  it("formats THB amounts with grouping", () => {
    expect(formatCurrency(1000, "THB")).toContain("1,000.00");
  });
  it("returns a dash for non-finite input", () => {
    expect(formatCurrency(Number.NaN, "USD")).toBe("—");
  });
});

describe("formatSignedCurrency", () => {
  it("prefixes a + for gains and - for losses", () => {
    expect(formatSignedCurrency(1000, "USD")).toBe("+$1,000.00");
    expect(formatSignedCurrency(-500, "USD")).toBe("-$500.00");
  });
});

describe("formatPercent", () => {
  it("formats to two decimals", () => {
    expect(formatPercent(12.3456)).toBe("12.35%");
  });
  it("can show an explicit sign for positives", () => {
    expect(formatPercent(8, { signed: true })).toBe("+8.00%");
    expect(formatPercent(-8, { signed: true })).toBe("-8.00%");
  });
});

describe("getInitials", () => {
  it("uses first + last initials for multi-word names", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });
  it("uses the first two letters for a single word", () => {
    expect(getInitials("apple")).toBe("AP");
  });
});

describe("toDateInputValue", () => {
  it("formats a local date as yyyy-mm-dd", () => {
    const ms = new Date(2026, 4, 31).getTime(); // 31 May 2026, local
    expect(toDateInputValue(ms)).toBe("2026-05-31");
  });
});
