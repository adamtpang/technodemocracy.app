import { houses } from "@/lib/mock-data";
import { HouseGrid } from "@/components/houses/house-grid";

export default function HousesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Houses</h1>
        <p className="text-muted-foreground mt-2">
          Browse the digital political parties of Network School. Find your
          tribe, stake your conviction.
        </p>
      </div>
      <HouseGrid houses={houses} />
    </div>
  );
}
