import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

type Accent = "brand" | "success" | "danger" | "neutral";

const ACCENT_BG: Record<Accent, string> = {
  brand: "bg-brand-50 text-brand",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-surface-2 text-muted",
};

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: Accent;
}

export function StatCard({ label, value, sub, icon, accent = "neutral" }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">{label}</p>
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl [&>svg]:h-4 [&>svg]:w-4",
              ACCENT_BG[accent],
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {sub && <div className="mt-1">{sub}</div>}
    </Card>
  );
}
