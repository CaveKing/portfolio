import { isFirebaseConfigured } from "@/lib/firebase/config";
import { AlertTriangleIcon } from "@/components/ui/icons";

/**
 * Shown only when real Firebase credentials are missing, so the app never
 * fails silently during local setup. Renders nothing once configured.
 */
export function SetupBanner({ className }: { className?: string }) {
  if (isFirebaseConfigured) return null;
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-foreground ${className ?? ""}`}
    >
      <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
      <p className="leading-relaxed">
        ยังไม่ได้เชื่อมต่อ Firebase — เพิ่มค่าใน{" "}
        <code className="rounded-md bg-surface px-1.5 py-0.5 text-xs">
          .env.local
        </code>{" "}
        เพื่อเปิดใช้งานการเข้าสู่ระบบและบันทึกข้อมูลจริง (ดูขั้นตอนใน README)
      </p>
    </div>
  );
}
