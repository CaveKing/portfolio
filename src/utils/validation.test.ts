import { describe, expect, it } from "vitest";
import {
  isEmailInput,
  normalizeSymbol,
  validateConfirmPassword,
  validateEmail,
  validateLoginIdentifier,
  validatePassword,
  validatePositiveNumber,
  validateUsername,
} from "./validation";

describe("isEmailInput", () => {
  it("detects an email by the @ sign", () => {
    expect(isEmailInput("a@b.com")).toBe(true);
    expect(isEmailInput("username")).toBe(false);
  });
});

describe("validateEmail", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("you@email.com")).toBeNull();
  });
  it("rejects empty or malformed emails", () => {
    expect(validateEmail("")).not.toBeNull();
    expect(validateEmail("nope")).not.toBeNull();
  });
});

describe("validateUsername", () => {
  it("accepts 3–20 chars of a-z, 0-9, _", () => {
    expect(validateUsername("invest_99")).toBeNull();
  });
  it("rejects too-short, too-long, or illegal characters", () => {
    expect(validateUsername("ab")).not.toBeNull();
    expect(validateUsername("a".repeat(21))).not.toBeNull();
    expect(validateUsername("bad name")).not.toBeNull();
    expect(validateUsername("กข")).not.toBeNull();
  });
});

describe("validatePassword", () => {
  it("requires at least 6 characters", () => {
    expect(validatePassword("123456")).toBeNull();
    expect(validatePassword("123")).not.toBeNull();
    expect(validatePassword("")).not.toBeNull();
  });
});

describe("validateConfirmPassword", () => {
  it("requires both to match", () => {
    expect(validateConfirmPassword("secret1", "secret1")).toBeNull();
    expect(validateConfirmPassword("secret1", "secret2")).not.toBeNull();
  });
});

describe("validateLoginIdentifier", () => {
  it("validates an email-looking identifier as an email", () => {
    expect(validateLoginIdentifier("bad@")).not.toBeNull();
    expect(validateLoginIdentifier("you@email.com")).toBeNull();
  });
  it("accepts a plain username", () => {
    expect(validateLoginIdentifier("trader")).toBeNull();
  });
});

describe("validatePositiveNumber", () => {
  it("requires a number greater than 0", () => {
    expect(validatePositiveNumber("10", "จำนวน")).toBeNull();
    expect(validatePositiveNumber("0", "จำนวน")).not.toBeNull();
    expect(validatePositiveNumber("", "จำนวน")).not.toBeNull();
    expect(validatePositiveNumber("abc", "จำนวน")).not.toBeNull();
  });
});

describe("normalizeSymbol", () => {
  it("trims and uppercases", () => {
    expect(normalizeSymbol("  aapl ")).toBe("AAPL");
  });
});
