import { PartyCard } from "./party-card";
import type { Party } from "@/lib/mock-data";

interface PartyGridProps {
  parties: Party[];
}

export function PartyGrid({ parties }: PartyGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {parties.map((party) => (
        <PartyCard key={party.id} party={party} />
      ))}
    </div>
  );
}
