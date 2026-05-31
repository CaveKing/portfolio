import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/layout/Logo";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col items-center text-center">
        <Logo withText={false} className="mb-4 scale-110" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-xs text-sm text-muted">{subtitle}</p>}
      </div>
      <Card className="p-6 sm:p-7">{children}</Card>
      {footer && (
        <div className="mt-6 text-center text-sm text-muted">{footer}</div>
      )}
    </div>
  );
}
