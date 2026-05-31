import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-content px-4 pb-28 pt-6 sm:px-6 sm:pb-14 sm:pt-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
