"use server";

import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";

export interface AuthFormState {
  error: string | null;
}

const registerSchema = z.object({
  name: z.string().trim().min(2, "Имя — минимум 2 символа").max(64),
  email: z.string().trim().toLowerCase().email("Некорректный email"),
  password: z.string().min(8, "Пароль — минимум 8 символов").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Пользователь с таким email уже зарегистрирован" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.create({ data: { name, email, passwordHash } });

  // Sign in right away and land on the library page.
  try {
    await signIn("credentials", { email, password, redirectTo: "/library" });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Аккаунт создан, но войти не удалось. Попробуйте на странице входа." };
  }
  return { error: null };
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const next = formData.get("next");
  const redirectTo = typeof next === "string" && next.startsWith("/") ? next : "/library";

  try {
    await signIn("credentials", { ...parsed.data, redirectTo });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      return { error: "Неверный email или пароль" };
    }
    throw error;
  }
  return { error: null };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
