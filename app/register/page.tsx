import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { currentUser } from "@/lib/auth";
import { registerAction } from "@/server/actions/auth";

export const metadata: Metadata = { title: "Регистрация" };

export default async function RegisterPage() {
  if (await currentUser()) redirect("/library");

  return (
    <div className="flex flex-1 items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Создать аккаунт</h1>
        <p className="mt-1.5 mb-7 text-sm text-mist">
          Сохраняйте тайтлы в «Смотреть позже» и «Избранное».
        </p>
        <AuthForm mode="register" action={registerAction} />
      </div>
    </div>
  );
}
