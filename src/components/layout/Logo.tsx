import { cn } from "@/utils/cn";
import { APP_NAME } from "@/constants";
import { TrendingUpIcon } from "@/components/ui/icons";

interface LogoProps {
  withText?: boolean;
  className?: string;
}

export function Logo({ withText = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-soft">
        <TrendingUpIcon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      {withText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </span>
      )}
    </span>
  );
}
