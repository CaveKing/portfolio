import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChangePill, pnlColor } from "./ChangePill";

describe("pnlColor", () => {
  it("maps sign to semantic color classes", () => {
    expect(pnlColor(5)).toContain("success");
    expect(pnlColor(-5)).toContain("danger");
    expect(pnlColor(0)).toContain("muted");
  });
});

describe("ChangePill", () => {
  it("renders a signed percentage by default", () => {
    render(<ChangePill value={200} percent={20} />);
    expect(screen.getByText("+20.00%")).toBeInTheDocument();
  });

  it("renders money and percent in 'both' mode", () => {
    render(<ChangePill value={-500} percent={-10} currency="USD" mode="both" />);
    expect(screen.getByText("-$500.00 (-10.00%)")).toBeInTheDocument();
  });
});
