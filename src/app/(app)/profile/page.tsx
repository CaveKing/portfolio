"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Button, Input } from "@/components/ui";
import { LoadingScreen } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { LockIcon, LogoutIcon, UserIcon } from "@/components/ui/icons";
import { useAuth } from "@/hooks/useAuth";
import {
  changeUsername,
  logout,
  requestPasswordReset,
} from "@/lib/auth/authService";
import { ROUTES } from "@/constants";
import { formatDate } from "@/utils/format";
import { getErrorMessage, UniqueConstraintError } from "@/utils/errors";
import { validateUsername } from "@/utils/validation";

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (profile) setUsername(profile.username);
  }, [profile]);

  if (!profile || !user) return <LoadingScreen />;

  const isDirty = username.trim() !== profile.username;

  async function handleSaveUsername(event: FormEvent) {
    event.preventDefault();
    if (!user || !profile) return;
    const error = validateUsername(username);
    setUsernameError(error);
    if (error) return;
    if (!isDirty) return;

    setSavingUsername(true);
    try {
      await changeUsername(
        user.uid,
        profile.usernameLower,
        username,
        profile.email,
      );
      await refreshProfile();
      toast.success("เปลี่ยนชื่อผู้ใช้แล้ว");
    } catch (caught) {
      if (caught instanceof UniqueConstraintError) {
        setUsernameError(caught.message);
      } else {
        toast.error(getErrorMessage(caught));
      }
    } finally {
      setSavingUsername(false);
    }
  }

  async function handlePasswordReset() {
    if (!user?.email) return;
    setSendingReset(true);
    try {
      await requestPasswordReset(user.email);
      toast.success("ส่งลิงก์เปลี่ยนรหัสผ่านไปที่อีเมลแล้ว");
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    } finally {
      setSendingReset(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.replace(ROUTES.login);
    } catch (caught) {
      toast.error(getErrorMessage(caught));
      setLoggingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        โปรไฟล์ และตั้งค่า
      </h1>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar name={profile.username} color={profile.avatarColor} size={64} />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-foreground">
              {profile.username}
            </p>
            <p className="truncate text-sm text-muted">{profile.email}</p>
            <p className="mt-0.5 text-xs text-muted">
              เป็นสมาชิกตั้งแต่ {formatDate(profile.createdAt)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeader
          icon={<UserIcon />}
          title="ชื่อผู้ใช้"
          description="ชื่อนี้ใช้แสดงในแอปและใช้เข้าสู่ระบบได้"
        />
        <form onSubmit={handleSaveUsername} className="mt-5 space-y-4">
          <Input
            label="ชื่อผู้ใช้"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={usernameError}
            hint={usernameError ? undefined : "ใช้ a-z, 0-9, _ ความยาว 3–20 ตัว"}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={savingUsername} disabled={!isDirty}>
              บันทึกชื่อผู้ใช้
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5 sm:p-6">
        <SectionHeader
          icon={<LockIcon />}
          title="ความปลอดภัย"
          description="จัดการรหัสผ่านและการเข้าสู่ระบบ"
        />
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-2 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">เปลี่ยนรหัสผ่าน</p>
              <p className="text-xs text-muted">
                เราจะส่งลิงก์เปลี่ยนรหัสผ่านไปที่ {user.email}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePasswordReset}
              loading={sendingReset}
            >
              ส่งลิงก์
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-2 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">ออกจากระบบ</p>
              <p className="text-xs text-muted">ออกจากบัญชีนี้บนอุปกรณ์นี้</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<LogoutIcon className="h-4 w-4" />}
              onClick={handleLogout}
              loading={loggingOut}
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
