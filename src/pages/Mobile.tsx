import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, MapPin, Clock, LogOut, AlertCircle, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import osuLogo from '@/assets/osu-logo.png';

const Mobile = () => {
  const [user, setUser] = useState<any>(null);
  const [currentReservation, setCurrentReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    checkCurrentReservation();

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

    const { data } = await supabase
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
    
    if (occupiedTime > (1.5 * 60 * 60 * 1000) && reservation.status === 'occupied') {
      await supabase
        .from('reservations')
        .update({ status: 'pending_confirm' })
        .eq('id', reservation.id);
        
      toast({
        title: 'Confirm Your Seat',
        description: 'You have occupied this seat for a while. Please confirm you are still using it.',
        duration: 10000,
      });
    }

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
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
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
        description: 'Your seat occupation has been confirmed.',
      });
      checkCurrentReservation();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
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
          <img src={osuLogo} alt="OSU Logo" className="h-24 w-24 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold mb-4">OSU Seat Navigator</h1>
          <p className="text-muted-foreground mb-6">Please log in to scan and reserve seats</p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img src={osuLogo} alt="OSU Logo" className="h-14 w-14 object-contain" />
            <h1 className="text-2xl font-bold">OSU Seat Navigator</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Home className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
        {user && (
          <p className="text-sm opacity-90">{user.email}</p>
        )}
      </header>

      <main className="p-4 space-y-4">
        {currentReservation ? (
          <Card className="p-6 border-2 border-primary bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Current Seat</h2>
                <p className="text-sm text-muted-foreground">You have an active reservation</p>
              </div>
              <Badge className="bg-primary">Occupied</Badge>
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
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please confirm you are still using this seat
                </p>
                <Button 
                  onClick={confirmOccupancy}
                  variant="outline"
                  className="w-full"
                >
                  Confirm Occupation
                </Button>
              </div>
            )}

            <Button 
              onClick={() => navigate('/scan')}
              variant="destructive"
              className="w-full mt-4"
            >
              Release Seat
            </Button>
          </Card>
        ) : (
          <Card className="p-6 border-2 border-dashed">
            <div className="text-center">
              <QrCode className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <h2 className="text-lg font-semibold mb-2">No Active Reservation</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Scan QR code to reserve a seat
              </p>
              <Button onClick={() => navigate('/scan')} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-muted/30">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <span className="text-primary">💡</span>
            How to Use
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>Click "Scan QR Code" button</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>Point camera at seat QR code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>Seat will be automatically reserved</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span>Click "Release Seat" when done</span>
            </li>
          </ul>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Auto-Release Policy</p>
              <p className="text-blue-700">
                Confirmation required after 1.5 hours of occupation. Seat will auto-release if not confirmed within 2 hours.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Mobile;
