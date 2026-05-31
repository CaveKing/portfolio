import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Transaction } from "@/types";

export type TransactionInput = Omit<Transaction, "id" | "createdAt">;

function historyRef(uid: string) {
  return collection(db, "transactions", uid, "history");
}

function toTransaction(snap: QueryDocumentSnapshot<DocumentData>): Transaction {
  const d = snap.data();
  return {
    id: snap.id,
    type: d.type,
    symbol: d.symbol,
    shares: d.shares,
    price: d.price,
    amount: d.amount,
    currency: d.currency,
    fee: d.fee,
    note: d.note,
    date: d.date,
    createdAt: d.createdAt,
  };
}

export function subscribeTransactions(
  uid: string,
  onData: (transactions: Transaction[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(historyRef(uid), orderBy("date", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(toTransaction)),
    onError,
  );
}

/** Strip undefined fields so Firestore does not reject the write. */
function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export async function addTransaction(
  uid: string,
  input: TransactionInput,
): Promise<void> {
  await addDoc(historyRef(uid), { ...clean(input), createdAt: Date.now() });
}

export async function deleteTransaction(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "transactions", uid, "history", id));
}
