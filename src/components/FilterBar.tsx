import { Building } from '@/types/seat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface FilterBarProps {
  selectedBuilding: Building | 'all';
  selectedFloor: number | 'all';
  onBuildingChange: (building: Building | 'all') => void;
  onFloorChange: (floor: number | 'all') => void;
  availableFloors: number[];
}

export const FilterBar = ({
  selectedBuilding,
  selectedFloor,
  onBuildingChange,
  onFloorChange,
  availableFloors,
}: FilterBarProps) => {
  const buildings: (Building | 'all')[] = [
    'all',
    'Thompson Library',
    '18th Avenue Library',
    'Architecture Library',
    'Fine Arts Library',
  ];

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Building</label>
          <Select
            value={selectedBuilding}
            onValueChange={(value) => onBuildingChange(value as Building | 'all')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((building) => (
                <SelectItem key={building} value={building}>
                  {building === 'all' ? 'All Buildings' : building}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Floor</label>
          <Select
            value={selectedFloor.toString()}
            onValueChange={(value) => onFloorChange(value === 'all' ? 'all' : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {availableFloors.map((floor) => (
                <SelectItem key={floor} value={floor.toString()}>
                  Floor {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
