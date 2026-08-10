import type { MomentCard as MomentCardData } from "@/types/moment";
import { MomentCard } from "./MomentCard";

interface MomentsGridProps {
  moments: MomentCardData[];
}

export function MomentsGrid({ moments }: MomentsGridProps) {
  if (moments.length === 0) return null;

  return (
    <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-14 lg:grid-cols-3 lg:items-start lg:gap-6">
      {moments.map((moment, index) => (
        <MomentCard key={moment.id} moment={moment} index={index} />
      ))}
    </div>
  );
}
