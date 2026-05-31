"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CURRENCIES } from "@/constants";
import {
  normalizeSymbol,
  validateNonNegativeNumber,
  validatePositiveNumber,
  validateRequired,
} from "@/utils/validation";
import { formatCurrency, toDateInputValue } from "@/utils/format";
import type { Currency, TransactionType } from "@/types";
import type { TransactionInput } from "@/services/transactionService";

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "buy", label: "ซื้อ" },
  { value: "sell", label: "ขาย" },
  { value: "deposit", label: "ฝาก" },
  { value: "withdraw", label: "ถอน" },
];

interface TransactionFormModalProps {
  open: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionInput) => void;
}

function parseDate(value: string): number {
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? Date.now() : ms;
}

export function TransactionFormModal({
  open,
  submitting,
  onClose,
  onSubmit,
}: TransactionFormModalProps) {
  const [type, setType] = useState<TransactionType>("buy");
  const [date, setDate] = useState(toDateInputValue(Date.now()));
  const [currency, setCurrency] = useState<Currency>("THB");
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");
  const [fee, setFee] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (!open) return;
    setType("buy");
    setDate(toDateInputValue(Date.now()));
    setCurrency("THB");
    setSymbol("");
    setShares("");
    setPrice("");
    setFee("");
    setAmount("");
    setNote("");
    setErrors({});
  }, [open]);

  const isTrade = type === "buy" || type === "sell";

  const computedTotal = useMemo(() => {
    const s = Number(shares);
    const p = Number(price);
    if (Number.isNaN(s) || Number.isNaN(p)) return 0;
    return s * p;
  }, [shares, price]);

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    const nextErrors: Record<string, string | undefined> = {};
    if (isTrade) {
      nextErrors.symbol = validateRequired(symbol, "สัญลักษณ์หุ้น") ?? undefined;
      nextErrors.shares = validatePositiveNumber(shares, "จำนวนหุ้น") ?? undefined;
      nextErrors.price = validateNonNegativeNumber(price, "ราคา") ?? undefined;
      if (fee.trim() !== "") {
        nextErrors.fee = validateNonNegativeNumber(fee, "ค่าธรรมเนียม") ?? undefined;
      }
    } else {
      nextErrors.amount = validatePositiveNumber(amount, "จำนวนเงิน") ?? undefined;
    }
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const base = {
      type,
      currency,
      date: parseDate(date),
      note: note.trim() || undefined,
    };

    if (isTrade) {
      onSubmit({
        ...base,
        symbol: normalizeSymbol(symbol),
        shares: Number(shares),
        price: Number(price),
        fee: fee.trim() !== "" ? Number(fee) : undefined,
        amount: Number(shares) * Number(price),
      });
    } else {
      onSubmit({ ...base, amount: Number(amount) });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="บันทึกรายการ"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button type="button" onClick={() => handleSubmit()} loading={submitting}>
            บันทึก
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <SegmentedControl
          fullWidth
          options={TYPE_OPTIONS}
          value={type}
          onChange={setType}
          aria-label="ประเภทรายการ"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="วันที่"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
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

        {isTrade ? (
          <>
            <Input
              label="สัญลักษณ์หุ้น"
              placeholder="เช่น AAPL, PTT"
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
              error={errors.symbol}
            />
            <div className="grid grid-cols-2 gap-3">
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
              <Input
                label="ราคา / หุ้น"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                error={errors.price}
              />
            </div>
            <Input
              label="ค่าธรรมเนียม (ไม่บังคับ)"
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              placeholder="0.00"
              value={fee}
              onChange={(event) => setFee(event.target.value)}
              error={errors.fee}
            />
            <div className="rounded-2xl bg-surface-2 px-4 py-3 text-sm">
              <span className="text-muted">มูลค่ารวม </span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatCurrency(computedTotal, currency)}
              </span>
            </div>
          </>
        ) : (
          <Input
            label="จำนวนเงิน"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            error={errors.amount}
          />
        )}

        <Textarea
          label="โน้ต (ไม่บังคับ)"
          rows={2}
          placeholder="รายละเอียดเพิ่มเติม…"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Modal>
  );
}
