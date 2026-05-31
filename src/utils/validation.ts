/** Username: 3–20 chars, letters/digits/underscore only. */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A login identifier is treated as an email if it contains "@". */
export function isEmailInput(input: string): boolean {
  return input.includes("@");
}

/** Returns an error message, or null when valid. */
export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return "กรุณากรอกอีเมล";
  if (!EMAIL_REGEX.test(value)) return "รูปแบบอีเมลไม่ถูกต้อง";
  return null;
}

export function validateUsername(username: string): string | null {
  const value = username.trim();
  if (!value) return "กรุณากรอกชื่อผู้ใช้";
  if (value.length < 3) return "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร";
  if (value.length > 20) return "ชื่อผู้ใช้ต้องไม่เกิน 20 ตัวอักษร";
  if (!USERNAME_REGEX.test(value))
    return "ใช้ได้เฉพาะ a-z, 0-9 และ _ เท่านั้น";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "กรุณากรอกรหัสผ่าน";
  if (password.length < 6) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return "กรุณายืนยันรหัสผ่าน";
  if (password !== confirm) return "รหัสผ่านไม่ตรงกัน";
  return null;
}

export function validateLoginIdentifier(input: string): string | null {
  const value = input.trim();
  if (!value) return "กรุณากรอกชื่อผู้ใช้หรืออีเมล";
  if (isEmailInput(value)) return validateEmail(value);
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `กรุณากรอก${label}`;
}

/** Validate a numeric input that must be > 0 (e.g. shares, price). */
export function validatePositiveNumber(
  value: number | string,
  label: string,
): string | null {
  const num = typeof value === "string" ? Number(value) : value;
  if (value === "" || value === null || value === undefined || Number.isNaN(num))
    return `กรุณากรอก${label}`;
  if (num <= 0) return `${label}ต้องมากกว่า 0`;
  return null;
}

/** Validate a numeric input that must be >= 0 (e.g. current price, fee). */
export function validateNonNegativeNumber(
  value: number | string,
  label: string,
): string | null {
  const num = typeof value === "string" ? Number(value) : value;
  if (value === "" || value === null || value === undefined || Number.isNaN(num))
    return `กรุณากรอก${label}`;
  if (num < 0) return `${label}ต้องไม่ติดลบ`;
  return null;
}

export function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}
