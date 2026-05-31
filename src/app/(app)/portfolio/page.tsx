"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { HoldingsTab } from "@/components/portfolio/HoldingsTab";
import { HistoryTab } from "@/components/portfolio/HistoryTab";
import { PerformanceTab } from "@/components/portfolio/PerformanceTab";
import { JournalTab } from "@/components/portfolio/JournalTab";

type Tab = "holdings" | "history" | "performance" | "journal";

const TABS: { value: Tab; label: string }[] = [
  { value: "holdings", label: "ถือครอง" },
  { value: "history", label: "ประวัติ" },
  { value: "performance", label: "ผลตอบแทน" },
  { value: "journal", label: "บันทึก" },
];

export default function PortfolioPage() {
  const [tab, setTab] = useState<Tab>("holdings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          พอร์ตของฉัน
        </h1>
        <p className="mt-1 text-sm text-muted">
          จัดการหุ้น ประวัติรายการ ผลตอบแทน และบันทึกการลงทุน
        </p>
      </div>

      <div className="max-w-full overflow-x-auto no-scrollbar">
        <SegmentedControl
          options={TABS}
          value={tab}
          onChange={setTab}
          aria-label="แท็บพอร์ต"
        />
      </div>

      <div>
        {tab === "holdings" && <HoldingsTab />}
        {tab === "history" && <HistoryTab />}
        {tab === "performance" && <PerformanceTab />}
        {tab === "journal" && <JournalTab />}
      </div>
    </div>
  );
}
