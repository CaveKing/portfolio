"use client";

import { IconButton } from "@/components/ui/IconButton";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { formatCurrency } from "@/utils/format";
import type { WatchItem } from "@/types";

interface Top5ItemRowProps {
  item: WatchItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function Top5ItemRow({
  item,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: Top5ItemRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/40 p-3 transition-colors hover:bg-surface-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{item.symbol}</span>
          {item.name && (
            <span className="truncate text-sm text-muted">{item.name}</span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
          {item.targetPrice != null && (
            <span>เป้าหมาย {formatCurrency(item.targetPrice, item.currency)}</span>
          )}
          {item.note && <span className="truncate">{item.note}</span>}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="เลื่อนขึ้น"
            className="flex h-5 w-7 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground disabled:opacity-25"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="เลื่อนลง"
            className="flex h-5 w-7 items-center justify-center rounded-md text-muted transition-colors hover:text-foreground disabled:opacity-25"
          >
            <ArrowDownIcon className="h-4 w-4" />
          </button>
        </div>
        <IconButton label="แก้ไข" onClick={onEdit}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
        <IconButton label="ลบ" tone="danger" onClick={onDelete}>
          <TrashIcon className="h-4 w-4" />
        </IconButton>
      </div>
    </li>
  );
}
