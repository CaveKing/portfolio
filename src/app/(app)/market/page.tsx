"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useHoldings, useTop5 } from "@/hooks/usePortfolioData";
import { updateHolding } from "@/services/portfolioService";
import { QuoteCard } from "@/components/market/QuoteCard";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { ActivityIcon, InfoIcon, RefreshIcon } from "@/components/ui/icons";
import { toYahooSymbol } from "@/utils/symbols";
import { formatDateTime } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";
import type { Currency, Holding } from "@/types";
import type { QuoteResult } from "@/app/api/quote/route";

const REFRESH_MS = 60 * 60 * 1000; // 1 ชั่วโมง

// แสดงเป็นค่าเริ่มต้นเมื่อผู้ใช้ยังไม่มีหุ้น/Top 5
const DEFAULT_SOURCES: { symbol: string; currency: Currency }[] = [
  { symbol: "AAPL", currency: "USD" },
  { symbol: "MSFT", currency: "USD" },
  { symbol: "NVDA", currency: "USD" },
  { symbol: "GOOGL", currency: "USD" },
  { symbol: "AMZN", currency: "USD" },
];

interface Source {
  display: string;
  name?: string;
  currency: Currency;
  yahoo: string;
}

export default function MarketPage() {
  const { user } = useAuth();
  const { data: holdings } = useHoldings();
  const { data: top5 } = useTop5();
  const toast = useToast();

  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const sources = useMemo<Source[]>(() => {
    const map = new Map<string, Source>();
    for (const h of holdings) {
      const yahoo = toYahooSymbol(h.symbol, h.currency);
      if (yahoo && !map.has(yahoo)) {
        map.set(yahoo, { display: h.symbol, name: h.name, currency: h.currency, yahoo });
      }
    }
    for (const w of top5) {
      const yahoo = toYahooSymbol(w.symbol, w.currency);
      if (yahoo && !map.has(yahoo)) {
        map.set(yahoo, { display: w.symbol, name: w.name, currency: w.currency, yahoo });
      }
    }
    if (map.size === 0) {
      for (const d of DEFAULT_SOURCES) {
        const yahoo = toYahooSymbol(d.symbol, d.currency);
        map.set(yahoo, { display: d.symbol, currency: d.currency, yahoo });
      }
    }
    return Array.from(map.values());
  }, [holdings, top5]);

  const symbolsKey = useMemo(() => sources.map((s) => s.yahoo).join(","), [sources]);

  const sourceByYahoo = useMemo(() => {
    const map = new Map<string, Source>();
    for (const s of sources) map.set(s.yahoo.toUpperCase(), s);
    return map;
  }, [sources]);

  const holdingByKey = useMemo(() => {
    const map = new Map<string, Holding>();
    for (const h of holdings) {
      map.set(`${h.symbol.toUpperCase()}|${h.currency}`, h);
    }
    return map;
  }, [holdings]);

  const fetchQuotes = useCallback(
    async (mode: "initial" | "refresh") => {
      if (!symbolsKey) {
        setQuotes([]);
        setLoading(false);
        return;
      }
      if (mode === "initial") setLoading(true);
      else setRefreshing(true);
      try {
        const res = await fetch(`/api/quote?symbols=${encodeURIComponent(symbolsKey)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("โหลดราคาไม่สำเร็จ");
        const data = (await res.json()) as { quotes: QuoteResult[]; fetchedAt: number };
        setQuotes(data.quotes ?? []);
        setLastUpdated(data.fetchedAt ?? Date.now());
        setError(null);
      } catch (caught) {
        setError(getErrorMessage(caught));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [symbolsKey],
  );

  useEffect(() => {
    fetchQuotes("initial");
    const id = window.setInterval(() => fetchQuotes("refresh"), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [fetchQuotes]);

  async function applyToHolding(quote: QuoteResult) {
    if (!user) return;
    const source =
      sourceByYahoo.get(quote.requested.toUpperCase()) ??
      sourceByYahoo.get(quote.symbol.toUpperCase());
    const currency = (quote.currency as Currency) ?? source?.currency;
    const display = source?.display;
    if (!display || !currency) return;
    const holding = holdingByKey.get(`${display.toUpperCase()}|${currency}`);
    if (!holding) return;

    setApplyingId(holding.id);
    try {
      await updateHolding(user.uid, holding.id, { currentPrice: quote.price });
      toast.success(`อัปเดตราคา ${display} ในพอร์ตแล้ว`);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    } finally {
      setApplyingId(null);
    }
  }

  function holdingFor(quote: QuoteResult): Holding | undefined {
    const source =
      sourceByYahoo.get(quote.requested.toUpperCase()) ??
      sourceByYahoo.get(quote.symbol.toUpperCase());
    const currency = (quote.currency as Currency) ?? source?.currency;
    if (!source?.display || !currency) return undefined;
    return holdingByKey.get(`${source.display.toUpperCase()}|${currency}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            ราคาเรียลไทม์
          </h1>
          <p className="mt-1 text-sm text-muted">
            ราคาหุ้นในพอร์ตและรายการที่สนใจ · อัปเดตอัตโนมัติทุก 1 ชั่วโมง
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden text-xs text-muted sm:inline">
              อัปเดตล่าสุด {formatDateTime(lastUpdated)}
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshIcon className="h-4 w-4" />}
            onClick={() => fetchQuotes("refresh")}
            loading={refreshing}
          >
            รีเฟรช
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error">
          {error} — ลองกด “รีเฟรช” อีกครั้ง (บางสัญลักษณ์อาจไม่มีข้อมูลในตลาด)
        </Alert>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ActivityIcon />}
            title="ยังไม่มีราคาให้แสดง"
            description="เพิ่มหุ้นในพอร์ตหรือใน Top 5 เพื่อดูราคาเรียลไทม์ของหุ้นที่คุณสนใจ"
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => {
            const source =
              sourceByYahoo.get(quote.requested.toUpperCase()) ??
              sourceByYahoo.get(quote.symbol.toUpperCase());
            const holding = holdingFor(quote);
            return (
              <QuoteCard
                key={quote.requested}
                quote={quote}
                name={source?.name}
                onApply={holding ? () => applyToHolding(quote) : undefined}
                applying={holding ? applyingId === holding.id : false}
              />
            );
          })}
        </div>
      )}

      <Card className="flex items-start gap-2.5 p-4">
        <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        <p className="text-sm leading-relaxed text-muted">
          ข้อมูลราคาจาก Yahoo Finance อาจล่าช้าประมาณ 15 นาทีและมีไว้เพื่อการติดตามเท่านั้น
          หุ้นไทยจะถูกค้นหาด้วยรหัส <span className="font-medium text-foreground">.BK</span> โดยอัตโนมัติ
          กดปุ่ม “อัปเดตราคานี้เข้าพอร์ต” เพื่อนำราคาล่าสุดไปคำนวณกำไร/ขาดทุนในพอร์ตของคุณ
        </p>
      </Card>
    </div>
  );
}
