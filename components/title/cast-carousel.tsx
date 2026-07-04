import Image from "next/image";
import { Carousel } from "@/components/ui/carousel";
import { Reveal, staggerDelay } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section";
import { profileUrl } from "@/lib/tmdb/image";
import type { CastMember } from "@/lib/tmdb/types";

export function CastCarousel({ cast }: { cast: CastMember[] }) {
  if (!cast.length) return null;

  return (
    <div>
      <SectionHeading title="В ролях" onDark />
      <Carousel onDark>
        {cast.map((member, index) => (
          <div key={member.id} className="w-32 shrink-0 snap-start">
            <Reveal delay={staggerDelay(index)}>
              <div className="overflow-hidden rounded-lg border border-line-dark bg-ink-2">
                <div className="relative aspect-2/3">
                  {member.profilePath ? (
                    <Image
                      src={profileUrl(member.profilePath)!}
                      alt={member.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-mist-dark">
                      <svg viewBox="0 0 24 24" className="size-8 stroke-current" fill="none" strokeWidth="1.5" aria-hidden>
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-white">{member.name}</p>
              <p className="line-clamp-1 text-xs text-mist-dark">{member.character}</p>
            </Reveal>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
