import { useState, useEffect } from 'react';
import { Seat, Building } from '@/types/seat';
import { mockSeats } from '@/data/mockSeats';
import { SeatDetailDialog } from '@/components/SeatDetailDialog';
import { BuildingSelector } from '@/components/BuildingSelector';
import { FloorMap } from '@/components/FloorMap';
import { StatsOverview } from '@/components/StatsOverview';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [seats, setSeats] = useState<Seat[]>(mockSeats);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>('Thompson Library');
  const [selectedFloor, setSelectedFloor] = useState<number | null>(1);
  const { toast } = useToast();

  // Auto-release seats after 2 hours
  useEffect(() => {
    const interval = setInterval(() => {
      setSeats((prevSeats) =>
        prevSeats.map((seat) => {
          if (seat.status === 'occupied' && seat.occupiedAt) {
            const elapsed = Date.now() - seat.occupiedAt.getTime();
            if (elapsed >= 7200000) {
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
    }, 60000);

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
      title: 'Seat Reserved! 🎉',
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

  const handleBuildingFloorSelect = (building: Building, floor: number) => {
    setSelectedBuilding(building);
    setSelectedFloor(floor);
  };

  // Get unique buildings and their floors
  const buildings = Array.from(
    seats.reduce((acc, seat) => {
      if (!acc.has(seat.building)) {
        acc.set(seat.building, new Set<number>());
      }
      acc.get(seat.building)?.add(seat.floor);
      return acc;
    }, new Map<string, Set<number>>())
  ).map(([name, floors]) => ({
    name: name as Building,
    floors: Array.from(floors).sort((a, b) => a - b),
  }));

  // Calculate seat counts per building-floor combination
  const seatCounts = new Map<string, { available: number; total: number }>();
  seats.forEach((seat) => {
    const key = `${seat.building}-${seat.floor}`;
    const current = seatCounts.get(key) || { available: 0, total: 0 };
    seatCounts.set(key, {
      available: current.available + (seat.status === 'available' ? 1 : 0),
      total: current.total + 1,
    });
  });

  // Filter seats for the selected building and floor
  const displayedSeats = seats.filter(
    (seat) => seat.building === selectedBuilding && seat.floor === selectedFloor
  );

  const totalSeats = seats.length;
  const availableSeats = seats.filter((s) => s.status === 'available').length;
  const occupiedSeats = seats.filter((s) => s.status === 'occupied').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                OSU Seat Finder
              </h1>
              <p className="text-muted-foreground text-sm">
                Find your perfect study spot across campus
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <StatsOverview
            totalSeats={totalSeats}
            availableSeats={availableSeats}
            occupiedSeats={occupiedSeats}
            buildingCount={buildings.length}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Building & Floor Selector */}
            <div className="lg:col-span-1">
              <BuildingSelector
                buildings={buildings}
                selectedBuilding={selectedBuilding}
                selectedFloor={selectedFloor}
                onSelect={handleBuildingFloorSelect}
                seatCounts={seatCounts}
              />
            </div>

            {/* Floor Map */}
            <div className="lg:col-span-2">
              {selectedBuilding && selectedFloor ? (
                <FloorMap
                  seats={displayedSeats}
                  onSeatClick={handleSeatClick}
                  building={selectedBuilding}
                  floor={selectedFloor}
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] bg-muted/20 rounded-lg border-2 border-dashed border-border">
                  <p className="text-muted-foreground">
                    Select a building and floor to view the map
                  </p>
                </div>
              )}
            </div>
          </div>
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
