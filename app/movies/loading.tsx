import { Section } from "@/components/ui/section";
import { GridSkeleton, SectionTitleSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <Section>
      <SectionTitleSkeleton />
      <GridSkeleton />
    </Section>
  );
}
