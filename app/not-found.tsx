import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-surface px-4 py-32 text-center">
      <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">Ошибка 404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tighter sm:text-4xl">
        Такой страницы нет
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-mist sm:text-base">
        Тайтл могли удалить из базы, или в адресе опечатка.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
      >
        На главную
      </Link>
    </div>
  );
}
