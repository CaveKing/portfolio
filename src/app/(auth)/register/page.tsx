"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SetupBanner } from "@/components/SetupBanner";
import { Alert, Button, Input, PasswordInput } from "@/components/ui";
import { AtIcon, LockIcon, MailIcon } from "@/components/ui/icons";
import { register } from "@/lib/auth/authService";
import { ROUTES } from "@/constants";
import { getErrorMessage, UniqueConstraintError } from "@/utils/errors";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/utils/validation";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const nextErrors: FieldErrors = {
      username: validateUsername(username) ?? undefined,
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
      confirm: validateConfirmPassword(password, confirm) ?? undefined,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await register({ username, email, password });
      router.replace(ROUTES.dashboard);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        setErrors((prev) => ({ ...prev, [error.field]: error.message }));
      } else {
        setFormError(getErrorMessage(error));
      }
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="สมัครสมาชิก"
      subtitle="สร้างบัญชีเพื่อเริ่มจัดการพอร์ตของคุณ"
      footer={
        <>
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href={ROUTES.login}
            className="font-medium text-brand hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </>
      }
    >
      <SetupBanner className="mb-5" />
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <Alert variant="error">{formError}</Alert>}
        <Input
          label="ชื่อผู้ใช้"
          placeholder="username"
          autoComplete="username"
          leftIcon={<AtIcon />}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          error={errors.username}
          hint={errors.username ? undefined : "ใช้ a-z, 0-9, _ ความยาว 3–20 ตัว"}
        />
        <Input
          label="อีเมล"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          leftIcon={<MailIcon />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <PasswordInput
          label="รหัสผ่าน"
          placeholder="อย่างน้อย 6 ตัวอักษร"
          autoComplete="new-password"
          leftIcon={<LockIcon />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <PasswordInput
          label="ยืนยันรหัสผ่าน"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<LockIcon />}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
        />
        <Button type="submit" fullWidth size="lg" loading={submitting}>
          สร้างบัญชี
        </Button>
      </form>
    </AuthShell>
  );
}
