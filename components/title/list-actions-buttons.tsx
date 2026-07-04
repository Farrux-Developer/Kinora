"use client";

import { useOptimistic, useTransition } from "react";
import { toggleListItem, type ToggleInput } from "@/server/actions/lists";

interface Membership {
  watchlist: boolean;
  favorite: boolean;
}

/** Optimistic "watch later" / "favorite" toggles on the title page. */
export function ListActionsButtons({
  item,
  initial,
}: {
  item: Omit<ToggleInput, "listType">;
  initial: Membership;
}) {
  const [membership, toggleOptimistic] = useOptimistic(
    initial,
    (state: Membership, key: keyof Membership) => ({ ...state, [key]: !state[key] }),
  );
  const [, startTransition] = useTransition();

  const toggle = (listType: "WATCHLIST" | "FAVORITE") => {
    startTransition(async () => {
      const key = listType === "WATCHLIST" ? "watchlist" : "favorite";
      toggleOptimistic(key);
      try {
        await toggleListItem({ ...item, listType });
      } catch {
        // server state wins — optimistic update rolls back automatically
      }
    });
  };

  const buttonClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors ${
      active
        ? "border-accent bg-accent text-white hover:bg-accent/90"
        : "border-line-dark text-white hover:bg-white/5"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => toggle("WATCHLIST")}
        aria-pressed={membership.watchlist}
        className={buttonClass(membership.watchlist)}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill={membership.watchlist ? "currentColor" : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" aria-hidden>
          <path d="M6 3h12v18l-6-4.5L6 21V3z" />
        </svg>
        {membership.watchlist ? "В списке" : "Смотреть позже"}
      </button>

      <button
        type="button"
        onClick={() => toggle("FAVORITE")}
        aria-pressed={membership.favorite}
        className={buttonClass(membership.favorite)}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill={membership.favorite ? "currentColor" : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" aria-hidden>
          <path d="M12 21s-7.5-4.7-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1 4.5 2.5h2C14 6 15.5 5 17.5 5 21 5 23 8.5 21.5 12c-2 4.3-9.5 9-9.5 9z" />
        </svg>
        {membership.favorite ? "В избранном" : "В избранное"}
      </button>
    </>
  );
}
