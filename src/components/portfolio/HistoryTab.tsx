"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { ClockIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { TransactionFormModal } from "./TransactionFormModal";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/usePortfolioData";
import {
  addTransaction,
  deleteTransaction,
  type TransactionInput,
} from "@/services/transactionService";
import { cn } from "@/utils/cn";
import { formatCurrency, formatDate, formatShares } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";
import type { Transaction, TransactionType } from "@/types";

type FilterValue = TransactionType | "all";

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "buy", label: "ซื้อ" },
  { value: "sell", label: "ขาย" },
  { value: "deposit", label: "ฝาก" },
  { value: "withdraw", label: "ถอน" },
];

const TYPE_META: Record<
  TransactionType,
  { label: string; direction: "in" | "out"; badge: "brand" | "success" | "warning" }
> = {
  buy: { label: "ซื้อ", direction: "out", badge: "brand" },
  sell: { label: "ขาย", direction: "in", badge: "success" },
  deposit: { label: "ฝากเงิน", direction: "in", badge: "success" },
  withdraw: { label: "ถอนเงิน", direction: "out", badge: "warning" },
};

function TransactionRow({
  transaction,
  onDelete,
}: {
  transaction: Transaction;
  onDelete: () => void;
}) {
  const meta = TYPE_META[transaction.type];
  const isTrade = transaction.type === "buy" || transaction.type === "sell";
  const sign = meta.direction === "in" ? "+" : "−";

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5">
      <Badge variant={meta.badge} className="shrink-0">
        {meta.label}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">
          {isTrade ? transaction.symbol : meta.label}
        </p>
        <p className="truncate text-xs text-muted">
          {isTrade
            ? `${formatShares(transaction.shares ?? 0)} หุ้น @ ${formatCurrency(
                transaction.price ?? 0,
                transaction.currency,
              )}`
            : transaction.note || "—"}
        </p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            meta.direction === "in" ? "text-success" : "text-foreground",
          )}
        >
          {sign}
          {formatCurrency(transaction.amount, transaction.currency)}
        </p>
        <p className="text-xs text-muted">{formatDate(transaction.date)}</p>
      </div>
      <IconButton label="ลบ" tone="danger" onClick={onDelete}>
        <TrashIcon className="h-4 w-4" />
      </IconButton>
    </li>
  );
}

export function HistoryTab() {
  const { user } = useAuth();
  const { data: transactions, loading } = useTransactions();
  const toast = useToast();

  const [filter, setFilter] = useState<FilterValue>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const uid = user?.uid;

  const filtered = useMemo(
    () =>
      filter === "all"
        ? transactions
        : transactions.filter((t) => t.type === filter),
    [transactions, filter],
  );

  async function handleSubmit(values: TransactionInput) {
    if (!uid) return;
    setSubmitting(true);
    try {
      await addTransaction(uid, values);
      toast.success("บันทึกรายการแล้ว");
      setModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!uid || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTransaction(uid, deleteTarget.id);
      toast.success("ลบรายการแล้ว");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-full overflow-x-auto no-scrollbar">
          <SegmentedControl
            size="sm"
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
            aria-label="กรองตามประเภท"
          />
        </div>
        <Button
          size="sm"
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={() => setModalOpen(true)}
        >
          บันทึกรายการ
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[68px] w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClockIcon />}
            title={filter === "all" ? "ยังไม่มีประวัติรายการ" : "ไม่มีรายการประเภทนี้"}
            description="บันทึกการซื้อ ขาย ฝาก หรือถอนเงิน เพื่อติดตามความเคลื่อนไหวของพอร์ต"
            action={
              <Button
                leftIcon={<PlusIcon className="h-4 w-4" />}
                onClick={() => setModalOpen(true)}
              >
                บันทึกรายการแรก
              </Button>
            }
          />
        </Card>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onDelete={() => setDeleteTarget(transaction)}
            />
          ))}
        </ul>
      )}

      <TransactionFormModal
        open={modalOpen}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="ลบรายการนี้?"
        message="รายการที่ลบแล้วไม่สามารถกู้คืนได้"
        destructive
        confirmLabel="ลบ"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
