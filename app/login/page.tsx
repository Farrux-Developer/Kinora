import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { currentUser } from "@/lib/auth";
import { loginAction } from "@/server/actions/auth";

export const metadata: Metadata = { title: "Вход" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await currentUser()) redirect("/library");
  const { next } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-paper px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8">
        <h1 className="text-2xl font-semibold tracking-tight">С возвращением</h1>
        <p className="mt-1.5 mb-7 text-sm text-mist">
          Войдите, чтобы открыть свои списки.
        </p>
        <AuthForm mode="login" action={loginAction} next={next} />
      </div>
    </div>
  );
}
