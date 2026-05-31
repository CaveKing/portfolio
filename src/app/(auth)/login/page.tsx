"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SetupBanner } from "@/components/SetupBanner";
import { Alert, Button, Input, PasswordInput } from "@/components/ui";
import { AtIcon, LockIcon } from "@/components/ui/icons";
import { login } from "@/lib/auth/authService";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/utils/errors";
import { validateLoginIdentifier } from "@/utils/validation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const identifierError = validateLoginIdentifier(identifier);
    const passwordError = password ? null : "กรุณากรอกรหัสผ่าน";
    setErrors({
      identifier: identifierError ?? undefined,
      password: passwordError ?? undefined,
    });
    if (identifierError || passwordError) return;

    setSubmitting(true);
    try {
      await login(identifier, password);
      router.replace(ROUTES.dashboard);
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="เข้าสู่ระบบ"
      subtitle="ยินดีต้อนรับกลับ เข้าสู่พอร์ตของคุณ"
      footer={
        <>
          ยังไม่มีบัญชี?{" "}
          <Link
            href={ROUTES.register}
            className="font-medium text-brand hover:underline"
          >
            สมัครสมาชิก
          </Link>
        </>
      }
    >
      <SetupBanner className="mb-5" />
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <Alert variant="error">{formError}</Alert>}
        <Input
          label="ชื่อผู้ใช้ หรือ อีเมล"
          placeholder="username หรือ you@email.com"
          autoComplete="username"
          leftIcon={<AtIcon />}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          error={errors.identifier}
        />
        <div>
          <PasswordInput
            label="รหัสผ่าน"
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={<LockIcon />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
          />
          <div className="mt-2 text-right">
            <Link
              href={ROUTES.forgotPassword}
              className="text-sm text-brand hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </div>
        <Button type="submit" fullWidth size="lg" loading={submitting}>
          เข้าสู่ระบบ
        </Button>
      </form>
    </AuthShell>
  );
}
