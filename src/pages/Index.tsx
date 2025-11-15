import { useState, useEffect } from 'react';
import { Seat, Building } from '@/types/seat';
import { mockSeats } from '@/data/mockSeats';
import { SeatCard } from '@/components/SeatCard';
import { SeatDetailDialog } from '@/components/SeatDetailDialog';
import { FilterBar } from '@/components/FilterBar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [seats, setSeats] = useState<Seat[]>(mockSeats);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | 'all'>('all');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const { toast } = useToast();

  // Auto-release seats after 2 hours
  useEffect(() => {
    const interval = setInterval(() => {
      setSeats((prevSeats) =>
        prevSeats.map((seat) => {
          if (seat.status === 'occupied' && seat.occupiedAt) {
            const elapsed = Date.now() - seat.occupiedAt.getTime();
            if (elapsed >= 7200000) { // 2 hours in milliseconds
              toast({
                title: 'Seat Auto-Released',
                description: `${seat.id} has been automatically released after 2 hours.`,
              });
              return { ...seat, status: 'available', occupant: undefined, occupiedAt: undefined };
            }
          }
          return seat;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [toast]);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    setDialogOpen(true);
  };

  const handleReserve = () => {
    if (!selectedSeat) return;
    
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === selectedSeat.id
          ? { ...seat, status: 'occupied', occupant: 'Current User', occupiedAt: new Date() }
          : seat
      )
    );
    
    toast({
      title: 'Seat Reserved!',
      description: `You have successfully reserved ${selectedSeat.id}.`,
    });
    
    setDialogOpen(false);
  };

  const handleRelease = () => {
    if (!selectedSeat) return;
    
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === selectedSeat.id
          ? { ...seat, status: 'available', occupant: undefined, occupiedAt: undefined }
          : seat
      )
    );
    
    toast({
      title: 'Seat Released',
      description: `${selectedSeat.id} is now available for others.`,
    });
    
    setDialogOpen(false);
  };

  const filteredSeats = seats.filter((seat) => {
    if (selectedBuilding !== 'all' && seat.building !== selectedBuilding) return false;
    if (selectedFloor !== 'all' && seat.floor !== selectedFloor) return false;
    return true;
  });

  const availableFloors = Array.from(
    new Set(
      seats
        .filter((seat) => selectedBuilding === 'all' || seat.building === selectedBuilding)
        .map((seat) => seat.floor)
    )
  ).sort((a, b) => a - b);

  const availableCount = filteredSeats.filter((seat) => seat.status === 'available').length;
  const occupiedCount = filteredSeats.filter((seat) => seat.status === 'occupied').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary mb-2">OSU Seat Finder</h1>
          <p className="text-muted-foreground">Find and reserve study seats across campus</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <FilterBar
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            onBuildingChange={setSelectedBuilding}
            onFloorChange={setSelectedFloor}
            availableFloors={availableFloors}
          />

          <div className="flex gap-4 flex-wrap">
            <Badge variant="outline" className="border-success text-success-foreground bg-success/10">
              {availableCount} Available
            </Badge>
            <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10">
              {occupiedCount} Occupied
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSeats.map((seat) => (
              <SeatCard key={seat.id} seat={seat} onClick={() => handleSeatClick(seat)} />
            ))}
          </div>

          {filteredSeats.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No seats found with the selected filters.</p>
            </div>
          )}
        </div>
      </main>

      <SeatDetailDialog
        seat={selectedSeat}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onReserve={handleReserve}
        onRelease={handleRelease}
      />
    </div>
  );
};

export default Index;
