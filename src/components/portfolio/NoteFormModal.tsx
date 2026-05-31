"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Textarea } from "@/components/ui";
import { validateRequired } from "@/utils/validation";
import type { JournalNote } from "@/types";
import type { JournalInput } from "@/services/journalService";

interface NoteFormModalProps {
  open: boolean;
  initial: JournalNote | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: JournalInput) => void;
}

function parseTags(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

export function NoteFormModal({
  open,
  initial,
  submitting,
  onClose,
  onSubmit,
}: NoteFormModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setContent(initial?.content ?? "");
    setTags(initial?.tags?.join(", ") ?? "");
    setError(null);
  }, [open, initial]);

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    const titleError = validateRequired(title, "หัวข้อ");
    if (titleError) {
      setError(titleError);
      return;
    }
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      tags: parseTags(tags),
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "แก้ไขบันทึก" : "เขียนบันทึกใหม่"}
      size="lg"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button type="button" onClick={() => handleSubmit()} loading={submitting}>
            {initial ? "บันทึก" : "เพิ่มบันทึก"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="หัวข้อ"
          placeholder="เช่น แผนการลงทุนไตรมาสนี้"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={error}
          autoFocus
        />
        <Textarea
          label="รายละเอียด"
          rows={6}
          placeholder="บันทึกความคิด เหตุผลการลงทุน หรือบทเรียน…"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <Input
          label="แท็ก (คั่นด้วยจุลภาค)"
          placeholder="เช่น กลยุทธ์, ปันผล, ระยะยาว"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Modal>
  );
}
