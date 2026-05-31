"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert, Button, PasswordInput } from "@/components/ui";
import { LoadingScreen } from "@/components/ui/Spinner";
import { LockIcon } from "@/components/ui/icons";
import { completePasswordReset, verifyResetCode } from "@/lib/auth/authService";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/utils/errors";
import { validateConfirmPassword, validatePassword } from "@/utils/validation";

type Status = "verifying" | "ready" | "invalid" | "done";

function ResetPasswordInner() {
  const params = useSearchParams();
  const oobCode = params.get("oobCode");

  const [status, setStatus] = useState<Status>("verifying");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    let active = true;
    verifyResetCode(oobCode)
      .then((mail) => {
        if (!active) return;
        setEmail(mail);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("invalid");
      });
    return () => {
      active = false;
    };
  }, [oobCode]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!oobCode) return;
    setFormError(null);
    const passwordError = validatePassword(password) ?? undefined;
    const confirmError = validateConfirmPassword(password, confirm) ?? undefined;
    setErrors({ password: passwordError, confirm: confirmError });
    if (passwordError || confirmError) return;

    setSubmitting(true);
    try {
      await completePasswordReset(oobCode, password);
      setStatus("done");
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  if (status === "verifying") {
    return (
      <AuthShell title="ตั้งรหัสผ่านใหม่">
        <div className="py-4">
          <LoadingScreen label="กำลังตรวจสอบลิงก์…" />
        </div>
      </AuthShell>
    );
  }

  if (status === "invalid") {
    return (
      <AuthShell
        title="ลิงก์ไม่ถูกต้อง"
        subtitle="ลิงก์รีเซ็ตรหัสผ่านหมดอายุหรือถูกใช้ไปแล้ว"
        footer={
          <Link
            href={ROUTES.forgotPassword}
            className="font-medium text-brand hover:underline"
          >
            ขอลิงก์รีเซ็ตใหม่
          </Link>
        }
      >
        <Alert variant="error">
          ไม่สามารถใช้ลิงก์นี้ได้ กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่อีกครั้ง
        </Alert>
      </AuthShell>
    );
  }

  if (status === "done") {
    return (
      <AuthShell
        title="เปลี่ยนรหัสผ่านสำเร็จ"
        subtitle="คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว"
        footer={
          <Link
            href={ROUTES.login}
            className="font-medium text-brand hover:underline"
          >
            ไปหน้าเข้าสู่ระบบ →
          </Link>
        }
      >
        <Alert variant="success">
          ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว เพื่อความปลอดภัยกรุณาเข้าสู่ระบบอีกครั้ง
        </Alert>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="ตั้งรหัสผ่านใหม่"
      subtitle={email ? `สำหรับบัญชี ${email}` : undefined}
      footer={
        <Link href={ROUTES.login} className="font-medium text-brand hover:underline">
          ← กลับไปหน้าเข้าสู่ระบบ
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <Alert variant="error">{formError}</Alert>}
        <PasswordInput
          label="รหัสผ่านใหม่"
          placeholder="อย่างน้อย 6 ตัวอักษร"
          autoComplete="new-password"
          leftIcon={<LockIcon />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <PasswordInput
          label="ยืนยันรหัสผ่านใหม่"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<LockIcon />}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
        />
        <Button type="submit" fullWidth size="lg" loading={submitting}>
          บันทึกรหัสผ่านใหม่
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
