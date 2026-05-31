"use client";

import { useFirestoreList } from "./useFirestoreList";
import { subscribeHoldings } from "@/services/portfolioService";
import { subscribeTransactions } from "@/services/transactionService";
import { subscribeNotes } from "@/services/journalService";
import { subscribeTop5 } from "@/services/watchlistService";
import type { Holding, JournalNote, Transaction, WatchItem } from "@/types";

export function useHoldings() {
  return useFirestoreList<Holding>(subscribeHoldings);
}

export function useTransactions() {
  return useFirestoreList<Transaction>(subscribeTransactions);
}

export function useNotes() {
  return useFirestoreList<JournalNote>(subscribeNotes);
}

export function useTop5() {
  return useFirestoreList<WatchItem>(subscribeTop5);
}
