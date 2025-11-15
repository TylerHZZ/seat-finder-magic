import { Seat } from '@/types/seat';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeatCardProps {
  seat: Seat;
  onClick: () => void;
}

export const SeatCard = ({ seat, onClick }: SeatCardProps) => {
  const getTimeOccupied = () => {
    if (!seat.occupiedAt) return '';
    const minutes = Math.floor((Date.now() - seat.occupiedAt.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5",
        "border-2",
        seat.status === 'available' ? "border-success/20 bg-success/5" : "border-warning/20 bg-warning/5"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{seat.id}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span>Floor {seat.floor}</span>
          </div>
        </div>
        <Badge 
          variant={seat.status === 'available' ? 'default' : 'secondary'}
          className={cn(
            seat.status === 'available' 
              ? "bg-success text-success-foreground" 
              : "bg-warning text-warning-foreground"
          )}
        >
          {seat.status === 'available' ? 'Available' : 'Occupied'}
        </Badge>
      </div>
      
      {seat.status === 'occupied' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
          <Clock className="h-3 w-3" />
          <span>Occupied for {getTimeOccupied()}</span>
        </div>
      )}
    </Card>
  );
};
