import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { JournalNote } from "@/types";

export type JournalInput = Pick<JournalNote, "title" | "content" | "tags">;

function notesRef(uid: string) {
  return collection(db, "journal", uid, "notes");
}

function toNote(snap: QueryDocumentSnapshot<DocumentData>): JournalNote {
  const d = snap.data();
  return {
    id: snap.id,
    title: d.title,
    content: d.content,
    tags: Array.isArray(d.tags) ? d.tags : [],
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export function subscribeNotes(
  uid: string,
  onData: (notes: JournalNote[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(notesRef(uid), orderBy("updatedAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toNote)),
    onError,
  );
}

export async function addNote(uid: string, input: JournalInput): Promise<void> {
  const now = Date.now();
  await addDoc(notesRef(uid), { ...input, createdAt: now, updatedAt: now });
}

export async function updateNote(
  uid: string,
  id: string,
  patch: Partial<JournalInput>,
): Promise<void> {
  await updateDoc(doc(db, "journal", uid, "notes", id), {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function deleteNote(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "journal", uid, "notes", id));
}
