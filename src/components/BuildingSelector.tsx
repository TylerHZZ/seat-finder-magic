import { Building } from '@/types/seat';
import { Card } from '@/components/ui/card';
import { Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuildingSelectorProps {
  buildings: { name: Building; floors: number[] }[];
  selectedBuilding: Building | null;
  selectedFloor: number | null;
  onSelect: (building: Building, floor: number) => void;
  seatCounts: Map<string, { available: number; total: number }>;
}

export const BuildingSelector = ({
  buildings,
  selectedBuilding,
  selectedFloor,
  onSelect,
  seatCounts,
}: BuildingSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Select Building & Floor</h2>
      </div>
      
      <div className="grid gap-4">
        {buildings.map((building) => (
          <Card key={building.name} className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
            <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {building.name}
              </h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {building.floors.map((floor) => {
                  const key = `${building.name}-${floor}`;
                  const counts = seatCounts.get(key) || { available: 0, total: 0 };
                  const isSelected = selectedBuilding === building.name && selectedFloor === floor;
                  const availabilityPercent = counts.total > 0 
                    ? Math.round((counts.available / counts.total) * 100) 
                    : 0;
                  
                  return (
                    <button
                      key={floor}
                      onClick={() => onSelect(building.name, floor)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all duration-200",
                        "hover:scale-105 hover:shadow-md",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-lg"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="text-sm font-medium">Floor {floor}</div>
                      <div className={cn(
                        "text-xs mt-1",
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {counts.available}/{counts.total} free
                      </div>
                      <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-300 rounded-full",
                            availabilityPercent > 50 ? "bg-success" : 
                            availabilityPercent > 20 ? "bg-warning" : "bg-destructive"
                          )}
                          style={{ width: `${availabilityPercent}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
