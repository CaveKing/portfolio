import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/format";

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, color = "#0071e3", size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: Math.round(size * 0.4),
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
