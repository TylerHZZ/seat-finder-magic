import { Seat } from '@/types/seat';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Import floor plan images
import thompsonFloor1 from '@/assets/floorplans/thompson-floor-1.png';
import thompsonFloor2 from '@/assets/floorplans/thompson-floor-2.png';
import thompsonFloor3 from '@/assets/floorplans/thompson-floor-3.png';
import thompsonFloor4 from '@/assets/floorplans/thompson-floor-4.png';

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

// Get floor plan image based on building and floor
const getFloorPlanImage = (building: string, floor: number): string | null => {
  if (building === 'Thompson Library') {
    switch (floor) {
      case 1:
        return thompsonFloor1;
      case 2:
        return thompsonFloor2;
      case 3:
        return thompsonFloor3;
      case 4:
        return thompsonFloor4;
      default:
        return null;
    }
  }
  return null;
};

// Define seat positions based on actual floor plans
const getSeatPositions = (building: string, floor: number): SeatPosition[] => {
  const baseKey = `${building}-${floor}F`;
  
  // Thompson Library Floor 1 - Study Spaces around East Atrium
  if (building === 'Thompson Library' && floor === 1) {
    return [
      { id: `${baseKey}-001`, x: 25, y: 35 }, // Study Space 145
      { id: `${baseKey}-002`, x: 35, y: 35 },
      { id: `${baseKey}-003`, x: 65, y: 35 }, // Study Space 140
      { id: `${baseKey}-004`, x: 75, y: 35 },
      { id: `${baseKey}-005`, x: 30, y: 65 }, // Gallery 125
      { id: `${baseKey}-006`, x: 60, y: 65 }, // Near 120
      { id: `${baseKey}-007`, x: 70, y: 65 },
      { id: `${baseKey}-008`, x: 25, y: 80 }, // Near Special Collections
    ];
  }
  
  // Thompson Library Floor 2 - Study Spaces and Reading Rooms
  if (building === 'Thompson Library' && floor === 2) {
    return [
      { id: `${baseKey}-001`, x: 30, y: 30 }, // Study Space left
      { id: `${baseKey}-002`, x: 40, y: 30 },
      { id: `${baseKey}-003`, x: 65, y: 30 }, // Study Space right
      { id: `${baseKey}-004`, x: 75, y: 30 },
      { id: `${baseKey}-005`, x: 50, y: 75 }, // Grand Reading Room 200
      { id: `${baseKey}-006`, x: 60, y: 75 },
      { id: `${baseKey}-007`, x: 30, y: 75 }, // Near 215 Microforms
      { id: `${baseKey}-008`, x: 70, y: 75 }, // Near 210 Study Space
    ];
  }
  
  // Thompson Library Floor 3 - Study Spaces around Tower
  if (building === 'Thompson Library' && floor === 3) {
    return [
      { id: `${baseKey}-001`, x: 30, y: 35 }, // Study Space left
      { id: `${baseKey}-002`, x: 40, y: 35 },
      { id: `${baseKey}-003`, x: 65, y: 35 }, // Study Space right
      { id: `${baseKey}-004`, x: 75, y: 35 },
      { id: `${baseKey}-005`, x: 30, y: 65 }, // Study Space lower left
      { id: `${baseKey}-006`, x: 65, y: 65 }, // Study Space lower right
      { id: `${baseKey}-007`, x: 40, y: 50 }, // Central area
      { id: `${baseKey}-008`, x: 60, y: 50 },
    ];
  }
  
  // Thompson Library Floor 4 - Quiet Study Areas
  if (building === 'Thompson Library' && floor === 4) {
    return [
      { id: `${baseKey}-001`, x: 20, y: 30 }, // Quiet Study 455
      { id: `${baseKey}-002`, x: 30, y: 30 }, // Quiet Study 445
      { id: `${baseKey}-003`, x: 70, y: 30 }, // Quiet Study 440
      { id: `${baseKey}-004`, x: 80, y: 30 }, // Quiet Study 450
    ];
  }
  
  // SEL Floor 1
  if (building === 'SEL' && floor === 1) {
    return [
      { id: `${baseKey}-001`, x: 20, y: 35 },
      { id: `${baseKey}-002`, x: 50, y: 35 },
      { id: `${baseKey}-003`, x: 80, y: 35 },
    ];
  }
  
  // SEL Floor 2
  if (building === 'SEL' && floor === 2) {
    return [
      { id: `${baseKey}-001`, x: 50, y: 40 },
    ];
  }
  
  // Union Floor 2
  if (building === 'Union' && floor === 2) {
    return [
      { id: `${baseKey}-001`, x: 25, y: 25 },
      { id: `${baseKey}-002`, x: 50, y: 25 },
      { id: `${baseKey}-003`, x: 75, y: 25 },
      { id: `${baseKey}-004`, x: 50, y: 60 },
    ];
  }
  
  return [];
};

export const FloorMap = ({ seats, onSeatClick, building, floor }: FloorMapProps) => {
  const [zoom, setZoom] = useState(1);
  const seatPositions = getSeatPositions(building, floor);
  const floorPlanImage = getFloorPlanImage(building, floor);
  
  // Create a map of seat IDs to seat data
  const seatMap = new Map(seats.map(seat => [seat.id, seat]));
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoom(1);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-background to-muted/30">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{building}</h3>
          <p className="text-sm text-muted-foreground">
            Floor {floor} - {floorPlanImage ? 'Real Floor Plan' : 'Interactive Map'}
          </p>
        </div>
        
        {/* Zoom controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.6}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleResetZoom}
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 2}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative w-full overflow-auto rounded-lg border-2 border-border bg-muted/10">
        <div 
          className="relative aspect-[4/3] min-h-[500px] transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Floor plan background or generated layout */}
          {floorPlanImage ? (
            <img
              src={floorPlanImage}
              alt={`${building} Floor ${floor} plan`}
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 bg-muted/20">
              {/* Fallback SVG layout for buildings without floor plans */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect 
                  x="5" y="10" width="90" height="80" 
                  fill="none" 
                  stroke="hsl(var(--border))" 
                  strokeWidth="0.5"
                  opacity="0.3"
                />
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
          )}
          
          {/* Seat markers overlay */}
          <div className="absolute inset-0">
            {seatPositions.map((position) => {
              const seat = seatMap.get(position.id);
              if (!seat) return null;
              
              const isAvailable = seat.status === 'available';
              
              return (
                <button
                  key={position.id}
                  onClick={() => onSeatClick(seat)}
                  className={cn(
                    "absolute w-10 h-10 -ml-5 -mt-5 rounded-full transition-all duration-300",
                    "flex items-center justify-center text-xs font-bold",
                    "hover:scale-150 hover:z-20 cursor-pointer",
                    "border-4 shadow-lg backdrop-blur-sm",
                    isAvailable 
                      ? "bg-success/90 border-success text-success-foreground hover:bg-success" 
                      : "bg-warning/90 border-warning text-warning-foreground animate-pulse hover:bg-warning"
                  )}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                  title={seat.id}
                >
                  <div className="w-3 h-3 rounded-full bg-current" />
                </button>
              );
            })}
          </div>
          
          {/* Building label watermark (only for non-image layouts) */}
          {!floorPlanImage && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
              <p className="text-6xl font-bold text-foreground whitespace-nowrap">
                {building.split(' ')[0]}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 mt-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-success border-4 border-success/60" />
          <span className="text-sm font-medium text-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-warning border-4 border-warning/60 animate-pulse" />
          <span className="text-sm font-medium text-foreground">Occupied</span>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">
          Click markers to view details • Use zoom controls to explore
        </span>
      </div>
    </Card>
  );
};
