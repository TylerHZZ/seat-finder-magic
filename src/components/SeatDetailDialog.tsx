import { Seat } from '@/types/seat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeatDetailDialogProps {
  seat: Seat | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReserve: () => void;
  onRelease: () => void;
}

export const SeatDetailDialog = ({
  seat,
  open,
  onOpenChange,
  onReserve,
  onRelease,
}: SeatDetailDialogProps) => {
  if (!seat) return null;

  const getTimeOccupied = () => {
    if (!seat.occupiedAt) return '';
    const minutes = Math.floor((Date.now() - seat.occupiedAt.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeRemaining = () => {
    if (!seat.occupiedAt) return '';
    const elapsed = Date.now() - seat.occupiedAt.getTime();
    const remaining = 7200000 - elapsed; // 2 hours in ms
    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return remaining > 0 ? `${hours}h ${mins}m` : 'Expired';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{seat.id}</span>
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
          </DialogTitle>
          <DialogDescription>
            {seat.building} - Floor {seat.floor}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{seat.building}, Floor {seat.floor}</span>
          </div>

          {seat.status === 'occupied' && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Occupied by {seat.occupant}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Occupied for {getTimeOccupied()}</span>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning-foreground">
                  Auto-release in: {getTimeRemaining()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Seats are automatically released after 2 hours
                </p>
              </div>
            </>
          )}

          {seat.status === 'available' && (
            <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
              <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {seat.status === 'available' ? (
            <Button 
              onClick={onReserve} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Reserve This Seat
            </Button>
          ) : (
            <Button 
              onClick={onRelease}
              variant="outline"
              className="w-full"
            >
              Release Seat
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
