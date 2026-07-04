"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthFormState } from "@/server/actions/auth";

const initialState: AuthFormState = { error: null };

const inputClass =
  "h-11 w-full rounded-md border border-line bg-surface px-3.5 text-sm text-fg placeholder:text-mist-2 transition-colors focus:border-accent focus:outline-none";

export function AuthForm({
  mode,
  action,
  next,
}: {
  mode: "login" | "register";
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isLogin = mode === "login";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      {!isLogin && (
        <label className="flex flex-col gap-1.5 text-sm font-medium text-fg">
          Имя
          <input name="name" type="text" required minLength={2} maxLength={64} placeholder="Как к вам обращаться" className={inputClass} />
        </label>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-medium text-fg">
        Email
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-fg">
        Пароль
        <input
          name="password"
          type="password"
          required
          minLength={isLogin ? 1 : 8}
          autoComplete={isLogin ? "current-password" : "new-password"}
          placeholder={isLogin ? "Ваш пароль" : "Минимум 8 символов"}
          className={inputClass}
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-md border border-line bg-paper px-3.5 py-2.5 text-sm text-fg">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-11 rounded-md bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
      >
        {pending ? "Секунду…" : isLogin ? "Войти" : "Создать аккаунт"}
      </button>

      <p className="text-center text-sm text-mist">
        {isLogin ? (
          <>
            Нет аккаунта?{" "}
            <Link href="/register" className="font-medium text-accent hover:underline">
              Зарегистрироваться
            </Link>
          </>
        ) : (
          <>
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Войти
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
