import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { UserProfile } from "@/types";

/** Document id of a username mapping (always lowercased). */
export function usernameKey(username: string): string {
  return username.trim().toLowerCase();
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid,
    username: d.username,
    usernameLower: d.usernameLower,
    email: d.email,
    avatarColor: d.avatarColor,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

/**
 * Read the email mapped to a username from the public `usernames` collection.
 * This lookup runs BEFORE authentication, so the collection is world-readable
 * (it only exposes the username → email mapping, nothing sensitive).
 */
export async function getEmailByUsername(username: string): Promise<string | null> {
  const snap = await getDoc(doc(db, "usernames", usernameKey(username)));
  if (!snap.exists()) return null;
  return (snap.data().email as string) ?? null;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "usernames", usernameKey(username)));
  return !snap.exists();
}
