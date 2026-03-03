import { HouseCard } from "./house-card";
import type { House } from "@/lib/mock-data";

interface HouseGridProps {
  houses: House[];
}

export function HouseGrid({ houses }: HouseGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {houses.map((house) => (
        <HouseCard key={house.id} house={house} />
      ))}
    </div>
  );
}
