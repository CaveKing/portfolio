"use client";

import { useEffect, useState } from "react";
import type { Unsubscribe } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { getErrorMessage } from "@/utils/errors";

type Subscribe<T> = (
  uid: string,
  onData: (items: T[]) => void,
  onError: (error: Error) => void,
) => Unsubscribe;

export interface ListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

/**
 * Subscribe to a per-user Firestore collection in real time.
 * Pass a module-level `subscribe` function (stable identity) so the effect
 * only re-runs when the authenticated user changes.
 */
export function useFirestoreList<T>(subscribe: Subscribe<T>): ListState<T> {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribe(
      user.uid,
      (items) => {
        setData(items);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(getErrorMessage(err));
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user, subscribe]);

  return { data, loading, error };
}
