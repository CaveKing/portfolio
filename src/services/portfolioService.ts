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
import type { Holding } from "@/types";

export type HoldingInput = Omit<Holding, "id" | "createdAt" | "updatedAt">;

function holdingsRef(uid: string) {
  return collection(db, "portfolio", uid, "holdings");
}

function toHolding(snap: QueryDocumentSnapshot<DocumentData>): Holding {
  const d = snap.data();
  return {
    id: snap.id,
    symbol: d.symbol,
    name: d.name,
    shares: d.shares,
    averageCost: d.averageCost,
    currentPrice: d.currentPrice,
    currency: d.currency,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export function subscribeHoldings(
  uid: string,
  onData: (holdings: Holding[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(holdingsRef(uid), orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toHolding)),
    onError,
  );
}

export async function addHolding(uid: string, input: HoldingInput): Promise<void> {
  const now = Date.now();
  await addDoc(holdingsRef(uid), { ...input, createdAt: now, updatedAt: now });
}

export async function updateHolding(
  uid: string,
  id: string,
  patch: Partial<HoldingInput>,
): Promise<void> {
  await updateDoc(doc(db, "portfolio", uid, "holdings", id), {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function deleteHolding(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "portfolio", uid, "holdings", id));
}
