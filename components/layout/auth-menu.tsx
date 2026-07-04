import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logoutAction } from "@/server/actions/auth";

export async function AuthMenu() {
  const user = await currentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:border-mist-2"
      >
        Войти
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/library"
        className="hidden items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:border-mist-2 sm:inline-flex"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
          {(user.name ?? user.email ?? "?").slice(0, 1).toUpperCase()}
        </span>
        Мои списки
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Выйти"
          title="Выйти"
          className="flex items-center justify-center rounded-md border border-line p-2 text-mist transition-colors hover:border-mist-2 hover:text-fg"
        >
          <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </form>
    </div>
  );
}
