"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { BookIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/ui/icons";
import { NoteFormModal } from "./NoteFormModal";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/usePortfolioData";
import {
  addNote,
  deleteNote,
  updateNote,
  type JournalInput,
} from "@/services/journalService";
import { formatRelativeTime } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";
import type { JournalNote } from "@/types";

function NoteCard({
  note,
  onEdit,
  onDelete,
}: {
  note: JournalNote;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 font-semibold text-foreground">{note.title}</h3>
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton label="แก้ไข" onClick={onEdit}>
            <PencilIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label="ลบ" tone="danger" onClick={onDelete}>
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      {note.content && (
        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted line-clamp-4">
          {note.content}
        </p>
      )}
      {note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="brand">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-muted">
        แก้ไขล่าสุด {formatRelativeTime(note.updatedAt)}
      </p>
    </Card>
  );
}

export function JournalTab() {
  const { user } = useAuth();
  const { data: notes, loading } = useNotes();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JournalNote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JournalNote | null>(null);
  const [deleting, setDeleting] = useState(false);

  const uid = user?.uid;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [notes, search]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(note: JournalNote) {
    setEditing(note);
    setModalOpen(true);
  }

  async function handleSubmit(values: JournalInput) {
    if (!uid) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateNote(uid, editing.id, values);
        toast.success("บันทึกการแก้ไขแล้ว");
      } else {
        await addNote(uid, values);
        toast.success("เพิ่มบันทึกแล้ว");
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
      await deleteNote(uid, deleteTarget.id);
      toast.success("ลบบันทึกแล้ว");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="ค้นหาบันทึก…"
            leftIcon={<SearchIcon />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="ค้นหาบันทึก"
          />
        </div>
        <Button
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={openAdd}
        >
          เขียนบันทึก
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookIcon />}
            title={search ? "ไม่พบบันทึกที่ค้นหา" : "ยังไม่มีบันทึก"}
            description={
              search
                ? "ลองใช้คำค้นอื่น หรือล้างช่องค้นหา"
                : "จดบันทึกแนวคิด เหตุผลการลงทุน และบทเรียนของคุณไว้ที่นี่"
            }
            action={
              !search ? (
                <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={openAdd}>
                  เขียนบันทึกแรก
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => openEdit(note)}
              onDelete={() => setDeleteTarget(note)}
            />
          ))}
        </div>
      )}

      <NoteFormModal
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
        title="ลบบันทึกนี้?"
        message={deleteTarget ? `ต้องการลบ “${deleteTarget.title}” หรือไม่` : undefined}
        destructive
        confirmLabel="ลบ"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
