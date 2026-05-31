"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Select } from "@/components/ui";
import { CURRENCIES } from "@/constants";
import {
  normalizeSymbol,
  validateNonNegativeNumber,
  validatePositiveNumber,
  validateRequired,
} from "@/utils/validation";
import type { Currency, Holding } from "@/types";
import type { HoldingInput } from "@/services/portfolioService";

interface HoldingFormModalProps {
  open: boolean;
  initial: Holding | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: HoldingInput) => void;
}

interface FieldErrors {
  symbol?: string;
  shares?: string;
  averageCost?: string;
  currentPrice?: string;
}

export function HoldingFormModal({
  open,
  initial,
  submitting,
  onClose,
  onSubmit,
}: HoldingFormModalProps) {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [shares, setShares] = useState("");
  const [averageCost, setAverageCost] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [currency, setCurrency] = useState<Currency>("THB");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;
    setSymbol(initial?.symbol ?? "");
    setName(initial?.name ?? "");
    setShares(initial ? String(initial.shares) : "");
    setAverageCost(initial ? String(initial.averageCost) : "");
    setCurrentPrice(initial ? String(initial.currentPrice) : "");
    setCurrency(initial?.currency ?? "THB");
    setErrors({});
  }, [open, initial]);

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    const nextErrors: FieldErrors = {
      symbol: validateRequired(symbol, "สัญลักษณ์หุ้น") ?? undefined,
      shares: validatePositiveNumber(shares, "จำนวนหุ้น") ?? undefined,
      averageCost: validateNonNegativeNumber(averageCost, "ต้นทุนเฉลี่ย") ?? undefined,
      currentPrice:
        validateNonNegativeNumber(currentPrice, "ราคาปัจจุบัน") ?? undefined,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    onSubmit({
      symbol: normalizeSymbol(symbol),
      name: name.trim() || undefined,
      shares: Number(shares),
      averageCost: Number(averageCost),
      currentPrice: Number(currentPrice),
      currency,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "แก้ไขหุ้น" : "เพิ่มหุ้นเข้าพอร์ต"}
      description="ราคาปัจจุบันอัปเดตเองได้ทุกเมื่อ เพื่อคำนวณกำไร/ขาดทุน"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button type="button" onClick={() => handleSubmit()} loading={submitting}>
            {initial ? "บันทึก" : "เพิ่มหุ้น"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="สัญลักษณ์หุ้น"
            placeholder="เช่น AAPL, PTT"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            error={errors.symbol}
            autoFocus
          />
          <Select
            label="สกุลเงิน"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </Select>
        </div>
        <Input
          label="ชื่อ (ไม่บังคับ)"
          placeholder="เช่น Apple Inc."
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="จำนวนหุ้น"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0"
          value={shares}
          onChange={(event) => setShares(event.target.value)}
          error={errors.shares}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="ต้นทุนเฉลี่ย / หุ้น"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00"
            value={averageCost}
            onChange={(event) => setAverageCost(event.target.value)}
            error={errors.averageCost}
          />
          <Input
            label="ราคาปัจจุบัน / หุ้น"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00"
            value={currentPrice}
            onChange={(event) => setCurrentPrice(event.target.value)}
            error={errors.currentPrice}
          />
        </div>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Modal>
  );
}
