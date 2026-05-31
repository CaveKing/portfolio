"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
import { LoadingScreen } from "@/components/ui/Spinner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(ROUTES.dashboard);
    }
  }, [user, loading, router]);

  if (loading || user) return <LoadingScreen />;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Soft ambient accents for a premium, spacious backdrop. */}
      <div className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#5e5ce6]/10 blur-3xl" />
      <div className="relative w-full max-w-md">{children}</div>
    </main>
  );
}
