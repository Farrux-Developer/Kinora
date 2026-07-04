/** Shown instead of catalog content when TMDB_API_KEY is missing. */
export function TmdbSetupNotice() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-line bg-paper p-8 text-center">
      <h2 className="text-lg font-semibold tracking-tight">Каталог не подключён</h2>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        Добавьте ключ TMDB API в файл <code className="rounded bg-line px-1.5 py-0.5 text-ink">.env</code>{" "}
        (переменная <code className="rounded bg-line px-1.5 py-0.5 text-ink">TMDB_API_KEY</code>) и
        перезапустите сервер. Инструкция по получению бесплатного ключа — в README.
      </p>
    </div>
  );
}
