import Link from "next/link";
import { Suspense } from "react";
import { SearchBox } from "@/components/search/search-box";
import { AuthMenu } from "./auth-menu";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <NavLinks className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-3">
          <SearchBox />
          <Link
            href="/search"
            aria-label="Поиск"
            className="flex items-center justify-center rounded-md border border-line p-2 text-mist transition-colors hover:border-mist-2 hover:text-ink lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>
          <Suspense fallback={<div className="h-8 w-16 rounded-md skeleton" />}>
            <AuthMenu />
          </Suspense>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
