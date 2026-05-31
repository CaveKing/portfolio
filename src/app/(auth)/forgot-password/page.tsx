"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert, Button, Input } from "@/components/ui";
import { MailIcon } from "@/components/ui/icons";
import { requestPasswordReset } from "@/lib/auth/authService";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/utils/errors";
import { validateEmail } from "@/utils/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (caught) {
      // Don't reveal whether an email is registered — treat "not found" as sent.
      const code =
        caught && typeof caught === "object" && "code" in caught
          ? String((caught as { code: unknown }).code)
          : "";
      if (code === "auth/user-not-found") {
        setSent(true);
      } else {
        setFormError(getErrorMessage(caught));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="ลืมรหัสผ่าน"
      subtitle="กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้"
      footer={
        <Link href={ROUTES.login} className="font-medium text-brand hover:underline">
          ← กลับไปหน้าเข้าสู่ระบบ
        </Link>
      }
    >
      {sent ? (
        <Alert variant="success">
          หากมีบัญชีที่ใช้อีเมล <strong>{email}</strong> เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปแล้ว
          กรุณาตรวจสอบกล่องจดหมาย (รวมถึงโฟลเดอร์สแปม)
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {formError && <Alert variant="error">{formError}</Alert>}
          <Input
            label="อีเมล"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            leftIcon={<MailIcon />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error}
          />
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            ส่งลิงก์รีเซ็ตรหัสผ่าน
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
