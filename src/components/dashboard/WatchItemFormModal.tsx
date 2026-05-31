"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { CURRENCIES } from "@/constants";
import { normalizeSymbol, validateRequired } from "@/utils/validation";
import type { Currency, WatchItem } from "@/types";
import type { WatchItemInput } from "@/services/watchlistService";

interface WatchItemFormModalProps {
  open: boolean;
  initial: WatchItem | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: WatchItemInput) => void;
}

export function WatchItemFormModal({
  open,
  initial,
  submitting,
  onClose,
  onSubmit,
}: WatchItemFormModalProps) {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<Currency>("THB");
  const [targetPrice, setTargetPrice] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSymbol(initial?.symbol ?? "");
    setName(initial?.name ?? "");
    setCurrency(initial?.currency ?? "THB");
    setTargetPrice(initial?.targetPrice != null ? String(initial.targetPrice) : "");
    setNote(initial?.note ?? "");
    setError(null);
  }, [open, initial]);

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    const symbolError = validateRequired(symbol, "สัญลักษณ์หุ้น");
    if (symbolError) {
      setError(symbolError);
      return;
    }
    const trimmedTarget = targetPrice.trim();
    let parsedTarget: number | undefined;
    if (trimmedTarget !== "") {
      parsedTarget = Number(trimmedTarget);
      if (Number.isNaN(parsedTarget) || parsedTarget < 0) {
        setError("ราคาเป้าหมายไม่ถูกต้อง");
        return;
      }
    }
    onSubmit({
      symbol: normalizeSymbol(symbol),
      name: name.trim() || undefined,
      currency,
      targetPrice: parsedTarget,
      note: note.trim() || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "แก้ไขรายการ" : "เพิ่มหุ้นน่าซื้อ"}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button type="button" onClick={() => handleSubmit()} loading={submitting}>
            {initial ? "บันทึก" : "เพิ่ม"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="สัญลักษณ์หุ้น"
          placeholder="เช่น AAPL, PTT"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          error={error}
          autoFocus
        />
        <Input
          label="ชื่อ (ไม่บังคับ)"
          placeholder="เช่น Apple Inc."
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
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
          <Input
            label="ราคาเป้าหมาย"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00"
            value={targetPrice}
            onChange={(event) => setTargetPrice(event.target.value)}
          />
        </div>
        <Textarea
          label="โน้ต (ไม่บังคับ)"
          rows={3}
          placeholder="เหตุผลที่น่าซื้อ…"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Modal>
  );
}
