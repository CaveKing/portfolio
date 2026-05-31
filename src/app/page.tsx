"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, APP_NAME } from "@/constants";
import { Logo } from "@/components/layout/Logo";
import { Spinner } from "@/components/ui/Spinner";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? ROUTES.dashboard : ROUTES.login);
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <Logo withText={false} className="scale-125" />
      <div className="flex items-center gap-2.5 text-muted">
        <Spinner className="h-5 w-5 text-brand" />
        <span className="text-sm">กำลังเข้าสู่ {APP_NAME}…</span>
      </div>
    </main>
  );
}
