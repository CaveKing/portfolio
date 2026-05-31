import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { WatchItem } from "@/types";

export type WatchItemInput = Omit<
  WatchItem,
  "id" | "order" | "createdAt" | "updatedAt"
>;

function top5Ref(uid: string) {
  return collection(db, "watchlist", uid, "top5");
}

function toWatchItem(snap: QueryDocumentSnapshot<DocumentData>): WatchItem {
  const d = snap.data();
  return {
    id: snap.id,
    symbol: d.symbol,
    name: d.name,
    targetPrice: d.targetPrice,
    currency: d.currency,
    note: d.note,
    order: d.order ?? 0,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export function subscribeTop5(
  uid: string,
  onData: (items: WatchItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(top5Ref(uid), orderBy("order", "asc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toWatchItem)),
    onError,
  );
}

export async function addWatchItem(
  uid: string,
  input: WatchItemInput,
  order: number,
): Promise<void> {
  const now = Date.now();
  await addDoc(top5Ref(uid), {
    ...clean(input),
    order,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateWatchItem(
  uid: string,
  id: string,
  patch: Partial<WatchItemInput>,
): Promise<void> {
  await updateDoc(doc(db, "watchlist", uid, "top5", id), {
    ...clean(patch),
    updatedAt: Date.now(),
  });
}

export async function deleteWatchItem(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "watchlist", uid, "top5", id));
}

/** Persist a new ordering: each id's index becomes its `order`. */
export async function reorderTop5(uid: string, orderedIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "watchlist", uid, "top5", id), {
      order: index,
      updatedAt: Date.now(),
    });
  });
  await batch.commit();
}
