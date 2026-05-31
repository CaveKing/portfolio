import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";
import { doc, runTransaction } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { getEmailByUsername, isUsernameAvailable, usernameKey } from "@/services/userService";
import { authErrorMessage, UniqueConstraintError } from "@/utils/errors";
import { colorFromString } from "@/utils/color";
import { isEmailInput } from "@/utils/validation";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

/**
 * Register a new account.
 * 1. Create the Firebase Auth user (enforces unique email).
 * 2. Atomically write the user profile + username→email mapping, guarding
 *    username uniqueness inside a transaction.
 * If the mapping write fails, the orphaned auth account is rolled back.
 */
export async function register({ username, email, password }: RegisterInput): Promise<void> {
  const cleanUsername = username.trim();
  const cleanEmail = email.trim();
  const key = usernameKey(cleanUsername);

  // Fast pre-check for a friendlier error before creating the account.
  if (!(await isUsernameAvailable(key))) {
    throw new UniqueConstraintError("username", "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว");
  }

  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const { uid } = credential.user;

  try {
    await runTransaction(db, async (tx) => {
      const usernameRef = doc(db, "usernames", key);
      const existing = await tx.get(usernameRef);
      if (existing.exists()) {
        throw new UniqueConstraintError("username", "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว");
      }
      const now = Date.now();
      tx.set(usernameRef, { email: cleanEmail, uid, username: cleanUsername });
      tx.set(doc(db, "users", uid), {
        username: cleanUsername,
        usernameLower: key,
        email: cleanEmail,
        avatarColor: colorFromString(key),
        createdAt: now,
        updatedAt: now,
      });
    });
  } catch (error) {
    // Roll back the auth account so the email is free to retry.
    await credential.user.delete().catch(() => undefined);
    throw error;
  }
}

/**
 * Log in with either an email or a username.
 * For a username, resolve the associated email via Firestore first, then
 * authenticate with Firebase Auth using email + password.
 */
export async function login(identifier: string, password: string): Promise<void> {
  const id = identifier.trim();
  let email = id;

  if (!isEmailInput(id)) {
    const mapped = await getEmailByUsername(id);
    if (!mapped) {
      // Generic message to avoid revealing which usernames exist.
      throw new Error(authErrorMessage("auth/invalid-credential"));
    }
    email = mapped;
  }

  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/** Verify a reset code (oobCode) and return the email it belongs to. */
export async function verifyResetCode(oobCode: string): Promise<string> {
  return verifyPasswordResetCode(auth, oobCode);
}

export async function completePasswordReset(oobCode: string, newPassword: string): Promise<void> {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

/**
 * Change the current user's username, atomically moving the username→email
 * mapping and guarding uniqueness.
 */
export async function changeUsername(
  uid: string,
  currentUsernameLower: string,
  newUsername: string,
  email: string,
): Promise<void> {
  const cleanUsername = newUsername.trim();
  const newKey = usernameKey(cleanUsername);
  const isSameKey = newKey === currentUsernameLower;

  await runTransaction(db, async (tx) => {
    const newRef = doc(db, "usernames", newKey);
    if (!isSameKey) {
      const exists = await tx.get(newRef);
      if (exists.exists()) {
        throw new UniqueConstraintError("username", "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว");
      }
    }
    tx.set(
      doc(db, "users", uid),
      { username: cleanUsername, usernameLower: newKey, updatedAt: Date.now() },
      { merge: true },
    );
    tx.set(newRef, { email, uid, username: cleanUsername });
    if (!isSameKey) {
      tx.delete(doc(db, "usernames", currentUsernameLower));
    }
  });
}
