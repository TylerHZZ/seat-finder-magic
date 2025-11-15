import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Mobile = () => {
  const [user, setUser] = useState<any>(null);
  const [currentReservation, setCurrentReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    checkCurrentReservation();

    // Listen to realtime updates
    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations'
        },
        () => {
          checkCurrentReservation();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const checkCurrentReservation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'occupied')
      .maybeSingle();

    if (data) {
      setCurrentReservation(data);
      checkLongOccupancy(data);
    } else {
      setCurrentReservation(null);
    }
  };

  const checkLongOccupancy = async (reservation: any) => {
    const occupiedTime = new Date().getTime() - new Date(reservation.occupied_at).getTime();
    const twoHours = 2 * 60 * 60 * 1000;
    
    // If occupied for more than 1.5 hours, mark as pending confirmation
    if (occupiedTime > (1.5 * 60 * 60 * 1000) && reservation.status === 'occupied') {
      await supabase
        .from('reservations')
        .update({ status: 'pending_confirm' })
        .eq('id', reservation.id);
        
      toast({
        title: 'Confirm Your Seat',
        description: 'You have been occupying this seat for a while. Please confirm you are still using it.',
        duration: 10000,
      });
    }

    // Auto-release after 2 hours if not confirmed
    if (occupiedTime > twoHours && !reservation.confirmed_at) {
      await supabase
        .from('reservations')
        .update({ 
          status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('id', reservation.id);
        
      toast({
        title: 'Seat Released',
        description: 'Your seat has been automatically released due to inactivity.',
      });
    }
  };

  const getTimeOccupied = () => {
    if (!currentReservation) return '';
    const minutes = Math.floor((Date.now() - new Date(currentReservation.occupied_at).getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const confirmOccupancy = async () => {
    if (!currentReservation) return;

    const { error } = await supabase
      .from('reservations')
      .update({ 
        confirmed_at: new Date().toISOString(),
        status: 'occupied'
      })
      .eq('id', currentReservation.id);

    if (!error) {
      toast({
        title: 'Confirmed',
        description: 'Your seat occupancy has been confirmed.',
      });
      checkCurrentReservation();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">OSU Seat Finder</h1>
          <p className="text-muted-foreground mb-6">Please sign in to scan and reserve seats</p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <h1 className="text-xl font-bold">OSU Seat Finder</h1>
        <p className="text-sm opacity-90">Mobile Scanner</p>
      </header>

      <main className="p-4 space-y-4">
        {/* Current Reservation Card */}
        {currentReservation ? (
          <Card className="p-6 border-2 border-success bg-success/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Current Seat</h2>
                <p className="text-sm text-muted-foreground">You have an active reservation</p>
              </div>
              <CheckCircle className="h-6 w-6 text-success" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{currentReservation.seat_id}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentReservation.building} - Floor {currentReservation.floor}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Occupied for {getTimeOccupied()}</span>
              </div>
            </div>

            {currentReservation.status === 'pending_confirm' && (
              <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning-foreground mb-2">
                  ⚠️ Please confirm you're still using this seat
                </p>
                <Button 
                  onClick={confirmOccupancy}
                  variant="outline"
                  className="w-full"
                >
                  Confirm Occupancy
                </Button>
              </div>
            )}

            <Button 
              onClick={() => navigate('/scan')}
              variant="destructive"
              className="w-full mt-4"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Release Seat
            </Button>
          </Card>
        ) : (
          <Card className="p-6 border-2 border-dashed">
            <div className="text-center">
              <QrCode className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h2 className="text-lg font-semibold mb-2">No Active Reservation</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Scan a QR code to reserve a seat
              </p>
              <Button onClick={() => navigate('/scan')} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/')}>
            <MapPin className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-sm">View Map</h3>
            <p className="text-xs text-muted-foreground">See available seats</p>
          </Card>

          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/scan')}>
            <QrCode className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium text-sm">Scan Code</h3>
            <p className="text-xs text-muted-foreground">Reserve a seat</p>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-muted/30">
          <h3 className="font-medium mb-2">How it works</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Scan QR code to occupy a seat</li>
            <li>• Scan again to release the seat</li>
            <li>• Confirm occupancy after 1.5 hours</li>
            <li>• Auto-release after 2 hours if not confirmed</li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default Mobile;
