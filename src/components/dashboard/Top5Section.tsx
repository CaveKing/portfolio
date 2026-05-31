"use client";

import { useState } from "react";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { PlusIcon, SparklesIcon } from "@/components/ui/icons";
import { WatchItemFormModal } from "./WatchItemFormModal";
import { Top5ItemRow } from "./Top5ItemRow";
import { useAuth } from "@/hooks/useAuth";
import { useTop5 } from "@/hooks/usePortfolioData";
import {
  addWatchItem,
  deleteWatchItem,
  reorderTop5,
  updateWatchItem,
  type WatchItemInput,
} from "@/services/watchlistService";
import { MAX_TOP5 } from "@/constants";
import { getErrorMessage } from "@/utils/errors";
import type { WatchItem } from "@/types";

export function Top5Section() {
  const { user } = useAuth();
  const { data: items, loading } = useTop5();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WatchItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WatchItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const uid = user?.uid;
  const isFull = items.length >= MAX_TOP5;

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: WatchItem) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSubmit(values: WatchItemInput) {
    if (!uid) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateWatchItem(uid, editing.id, values);
        toast.success("บันทึกการแก้ไขแล้ว");
      } else {
        await addWatchItem(uid, values, items.length);
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
      await deleteWatchItem(uid, deleteTarget.id);
      toast.success("ลบรายการแล้ว");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (!uid) return;
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    try {
      await reorderTop5(
        uid,
        next.map((item) => item.id),
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <SectionHeader
        icon={<SparklesIcon />}
        title="Top 5 หุ้นน่าซื้อ"
        description="หุ้นที่คุณสนใจอยากลงทุน จัดอันดับเองได้"
        action={
          <Button
            size="sm"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={openAdd}
            disabled={isFull}
          >
            เพิ่ม
          </Button>
        }
      />

      <div className="mt-5">
        {loading ? (
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[68px] w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<SparklesIcon />}
            title="ยังไม่มีหุ้นในลิสต์"
            description="เพิ่มหุ้นที่คุณคิดว่าน่าลงทุนได้สูงสุด 5 ตัว แล้วจัดอันดับตามใจ"
            action={
              <Button
                size="sm"
                leftIcon={<PlusIcon className="h-4 w-4" />}
                onClick={openAdd}
              >
                เพิ่มหุ้นแรก
              </Button>
            }
          />
        ) : (
          <ul className="space-y-2.5">
            {items.map((item, index) => (
              <Top5ItemRow
                key={item.id}
                item={item}
                index={index}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onMoveUp={() => move(index, -1)}
                onMoveDown={() => move(index, 1)}
                onEdit={() => openEdit(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </ul>
        )}
      </div>

      {isFull && (
        <p className="mt-3 text-xs text-muted">
          ครบ 5 รายการแล้ว — ลบรายการเดิมก่อนเพิ่มใหม่
        </p>
      )}

      <WatchItemFormModal
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
        title="ลบรายการนี้?"
        message={
          deleteTarget
            ? `ต้องการลบ ${deleteTarget.symbol} ออกจากลิสต์หรือไม่`
            : undefined
        }
        destructive
        confirmLabel="ลบ"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Card>
  );
}
