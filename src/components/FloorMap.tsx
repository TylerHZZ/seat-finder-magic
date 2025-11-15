import { Seat } from '@/types/seat';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FloorMapProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  building: string;
  floor: number;
}

interface SeatPosition {
  id: string;
  x: number;
  y: number;
}

// Define seat positions for each floor (in percentage of container)
const getSeatPositions = (building: string, floor: number): SeatPosition[] => {
  const baseKey = `${building}-${floor}F`;
  
  // Thompson Library Floor 3 - Study area layout
  if (building === 'Thompson Library' && floor === 3) {
    return [
      { id: `${baseKey}-001`, x: 15, y: 20 },
      { id: `${baseKey}-002`, x: 30, y: 20 },
      { id: `${baseKey}-003`, x: 45, y: 20 },
      { id: `${baseKey}-004`, x: 60, y: 20 },
      { id: `${baseKey}-005`, x: 15, y: 50 },
      { id: `${baseKey}-006`, x: 30, y: 50 },
      { id: `${baseKey}-007`, x: 60, y: 50 },
      { id: `${baseKey}-008`, x: 80, y: 50 },
    ];
  }
  
  // Thompson Library Floor 4 - Quiet study zone
  if (building === 'Thompson Library' && floor === 4) {
    return [
      { id: `${baseKey}-001`, x: 20, y: 30 },
      { id: `${baseKey}-002`, x: 40, y: 30 },
      { id: `${baseKey}-003`, x: 60, y: 30 },
      { id: `${baseKey}-004`, x: 80, y: 30 },
    ];
  }
  
  // Union Floor 2 - Collaborative spaces
  if (building === 'Union' && floor === 2) {
    return [
      { id: `${baseKey}-001`, x: 25, y: 25 },
      { id: `${baseKey}-002`, x: 50, y: 25 },
      { id: `${baseKey}-003`, x: 75, y: 25 },
      { id: `${baseKey}-004`, x: 50, y: 60 },
    ];
  }
  
  // SEL Floor 1 - Open study area
  if (building === 'SEL' && floor === 1) {
    return [
      { id: `${baseKey}-001`, x: 20, y: 35 },
      { id: `${baseKey}-002`, x: 50, y: 35 },
      { id: `${baseKey}-003`, x: 80, y: 35 },
    ];
  }
  
  // SEL Floor 2 - Quiet zone
  if (building === 'SEL' && floor === 2) {
    return [
      { id: `${baseKey}-001`, x: 50, y: 40 },
    ];
  }
  
  return [];
};

export const FloorMap = ({ seats, onSeatClick, building, floor }: FloorMapProps) => {
  const seatPositions = getSeatPositions(building, floor);
  
  // Create a map of seat IDs to seat data
  const seatMap = new Map(seats.map(seat => [seat.id, seat]));
  
  return (
    <Card className="p-6 bg-gradient-to-br from-background to-muted/30">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground">{building}</h3>
        <p className="text-sm text-muted-foreground">Floor {floor} - Interactive Map</p>
      </div>
      
      <div className="relative w-full aspect-[16/10] bg-muted/20 rounded-lg border-2 border-border overflow-hidden">
        {/* Floor plan background */}
        <div className="absolute inset-0">
          {/* Walls/rooms outline */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Main room outline */}
            <rect 
              x="5" y="10" width="90" height="80" 
              fill="none" 
              stroke="hsl(var(--border))" 
              strokeWidth="0.5"
              opacity="0.3"
            />
            
            {/* Interior divisions */}
            <line 
              x1="5" y1="45" x2="95" y2="45" 
              stroke="hsl(var(--border))" 
              strokeWidth="0.3" 
              strokeDasharray="2,2"
              opacity="0.2"
            />
            <line 
              x1="50" y1="10" x2="50" y2="90" 
              stroke="hsl(var(--border))" 
              strokeWidth="0.3" 
              strokeDasharray="2,2"
              opacity="0.2"
            />
          </svg>
        </div>
        
        {/* Seat markers */}
        {seatPositions.map((position) => {
          const seat = seatMap.get(position.id);
          if (!seat) return null;
          
          const isAvailable = seat.status === 'available';
          
          return (
            <button
              key={position.id}
              onClick={() => onSeatClick(seat)}
              className={cn(
                "absolute w-8 h-8 -ml-4 -mt-4 rounded-lg transition-all duration-300",
                "flex items-center justify-center text-xs font-semibold",
                "hover:scale-125 hover:z-10 hover:shadow-lg",
                "border-2 cursor-pointer",
                isAvailable 
                  ? "bg-success border-success/60 text-success-foreground shadow-success/20" 
                  : "bg-warning border-warning/60 text-warning-foreground shadow-warning/20 animate-pulse"
              )}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              title={seat.id}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
            </button>
          );
        })}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex gap-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success border-2 border-success/60" />
            <span className="text-xs font-medium text-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning border-2 border-warning/60" />
            <span className="text-xs font-medium text-foreground">Occupied</span>
          </div>
        </div>
        
        {/* Building label watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
          <p className="text-6xl font-bold text-foreground whitespace-nowrap">
            {building.split(' ')[0]}
          </p>
        </div>
      </div>
    </Card>
  );
};
