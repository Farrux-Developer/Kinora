"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_ITEMS } from "./nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-center rounded-md border border-line p-2 text-fg"
      >
        <svg viewBox="0 0 24 24" className="size-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-surface">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2" aria-label="Мобильная навигация">
            {[{ href: "/", label: "Главная" }, ...NAV_ITEMS, { href: "/search", label: "Поиск" }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-3 text-sm font-medium text-fg last:border-b-0"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
