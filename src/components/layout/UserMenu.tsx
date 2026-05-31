"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { ChevronDownIcon, LogoutIcon, UserIcon } from "@/components/ui/icons";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth/authService";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/utils/errors";

export function UserMenu() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const displayName = profile?.username ?? user?.email ?? "ผู้ใช้";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("ออกจากระบบแล้ว");
      router.replace(ROUTES.login);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLoggingOut(false);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-2xl py-1 pl-1 pr-2.5 transition-colors hover:bg-surface-2"
      >
        <Avatar name={displayName} color={profile?.avatarColor} size={34} />
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground sm:block">
          {displayName}
        </span>
        <ChevronDownIcon className="hidden h-4 w-4 text-muted sm:block" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-lifted animate-scale-in"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-foreground">
              {profile?.username ?? "ผู้ใช้"}
            </p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              href={ROUTES.profile}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              <UserIcon className="h-5 w-5 text-muted" />
              โปรไฟล์ และตั้งค่า
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-soft disabled:opacity-50"
            >
              <LogoutIcon className="h-5 w-5" />
              {loggingOut ? "กำลังออกจากระบบ…" : "ออกจากระบบ"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
