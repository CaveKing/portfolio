"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChangePill } from "@/components/ui/ChangePill";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { BriefcaseIcon, PencilIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { HoldingFormModal } from "./HoldingFormModal";
import { useAuth } from "@/hooks/useAuth";
import { useHoldings } from "@/hooks/usePortfolioData";
import {
  addHolding,
  deleteHolding,
  updateHolding,
  type HoldingInput,
} from "@/services/portfolioService";
import { aggregateByCurrency, computeHoldingMetrics } from "@/utils/calc";
import { formatCurrency, formatShares } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";
import type { Holding } from "@/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function HoldingCard({
  holding,
  onEdit,
  onDelete,
}: {
  holding: Holding;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const m = computeHoldingMetrics(holding);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              {holding.symbol}
            </span>
            <Badge>{holding.currency}</Badge>
          </div>
          {holding.name && (
            <p className="truncate text-sm text-muted">{holding.name}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton label="แก้ไข" onClick={onEdit}>
            <PencilIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label="ลบ" tone="danger" onClick={onDelete}>
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
        <Stat label="จำนวนหุ้น" value={formatShares(holding.shares)} />
        <Stat label="ต้นทุนเฉลี่ย" value={formatCurrency(holding.averageCost, holding.currency)} />
        <Stat label="ราคาปัจจุบัน" value={formatCurrency(holding.currentPrice, holding.currency)} />
        <Stat label="มูลค่าตลาด" value={formatCurrency(m.marketValue, holding.currency)} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm text-muted">กำไร / ขาดทุน</span>
        <ChangePill
          value={m.profitLoss}
          percent={m.profitLossPercent}
          currency={holding.currency}
          mode="both"
          size="md"
        />
      </div>
    </Card>
  );
}

export function HoldingsTab() {
  const { user } = useAuth();
  const { data: holdings, loading } = useHoldings();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Holding | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Holding | null>(null);
  const [deleting, setDeleting] = useState(false);

  const uid = user?.uid;
  const totals = useMemo(() => aggregateByCurrency(holdings), [holdings]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(holding: Holding) {
    setEditing(holding);
    setModalOpen(true);
  }

  async function handleSubmit(values: HoldingInput) {
    if (!uid) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateHolding(uid, editing.id, values);
        toast.success("บันทึกการแก้ไขแล้ว");
      } else {
        await addHolding(uid, values);
        toast.success("เพิ่มหุ้นแล้ว");
      }
      setModalOpen(false);
      setEditing(null);
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
      await deleteHolding(uid, deleteTarget.id);
      toast.success("ลบหุ้นแล้ว");
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
        <div className="flex flex-wrap gap-2">
          {totals.map((t) => (
            <span
              key={t.currency}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <span className="text-muted">{t.currency}</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(t.marketValue, t.currency)}
              </span>
              <ChangePill value={t.profitLoss} percent={t.profitLossPercent} />
            </span>
          ))}
        </div>
        <Button
          size="sm"
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={openAdd}
        >
          เพิ่มหุ้น
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : holdings.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BriefcaseIcon />}
            title="ยังไม่มีหุ้นในพอร์ต"
            description="เพิ่มหุ้นเพื่อติดตามจำนวน ต้นทุน ราคาปัจจุบัน และกำไร/ขาดทุน"
            action={
              <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={openAdd}>
                เพิ่มหุ้นตัวแรก
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {holdings.map((holding) => (
            <HoldingCard
              key={holding.id}
              holding={holding}
              onEdit={() => openEdit(holding)}
              onDelete={() => setDeleteTarget(holding)}
            />
          ))}
        </div>
      )}

      <HoldingFormModal
        open={modalOpen}
        initial={editing}
        submitting={submitting}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="ลบหุ้นนี้?"
        message={
          deleteTarget
            ? `ต้องการลบ ${deleteTarget.symbol} ออกจากพอร์ตหรือไม่`
            : undefined
        }
        destructive
        confirmLabel="ลบ"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
