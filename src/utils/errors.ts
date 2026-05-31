/** Map a Firebase Auth error code to a friendly Thai message. */
export function authErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "รูปแบบอีเมลไม่ถูกต้อง";
    case "auth/user-disabled":
      return "บัญชีนี้ถูกระงับการใช้งาน";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง";
    case "auth/email-already-in-use":
      return "อีเมลนี้ถูกใช้งานแล้ว";
    case "auth/weak-password":
      return "รหัสผ่านอ่อนเกินไป (อย่างน้อย 6 ตัวอักษร)";
    case "auth/too-many-requests":
      return "พยายามหลายครั้งเกินไป กรุณาลองใหม่ภายหลัง";
    case "auth/network-request-failed":
      return "เชื่อมต่อเครือข่ายไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต";
    case "auth/missing-password":
      return "กรุณากรอกรหัสผ่าน";
    case "auth/invalid-action-code":
    case "auth/expired-action-code":
      return "ลิงก์รีเซ็ตรหัสผ่านหมดอายุหรือถูกใช้ไปแล้ว";
    case "auth/operation-not-allowed":
      return "ยังไม่ได้เปิดใช้งานวิธีนี้ใน Firebase Console";
    case "auth/configuration-not-found":
    case "auth/invalid-api-key":
      return "ยังไม่ได้ตั้งค่า Firebase กรุณาตรวจสอบไฟล์ .env.local";
    default:
      return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
  }
}

interface CodedError {
  code: string;
}

function hasStringCode(error: unknown): error is CodedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

/** Best-effort human-readable message for any thrown value. */
export function getErrorMessage(error: unknown): string {
  if (hasStringCode(error) && error.code.startsWith("auth/")) {
    return authErrorMessage(error.code);
  }
  if (error instanceof Error && error.message) return error.message;
  return "เกิดข้อผิดพลาดที่ไม่รู้จัก";
}

/** Custom error used when a username/email is already taken at registration. */
export class UniqueConstraintError extends Error {
  constructor(public field: "username" | "email", message: string) {
    super(message);
    this.name = "UniqueConstraintError";
  }
}
