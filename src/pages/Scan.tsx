import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import osuLogo from '@/assets/osu-logo.png';

const Scan = () => {
  const [scanning, setScanning] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user && !scanning) {
      initializeScanner();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const initializeScanner = () => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(onScanSuccess, onScanError);
    setScanning(true);

    return () => {
      scanner.clear();
    };
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);

    try {
      // Parse QR code data (format: "Thompson-3F-001" or "18th-1F-001")
      const seatId = decodedText.trim();
      const parts = seatId.split('-');
      
      if (parts.length < 3) {
        toast({
          title: 'Invalid QR Code',
          description: 'This QR code is not a valid seat code.',
          variant: 'destructive',
        });
        return;
      }

      // Map prefix to full building name
      const buildingMap: { [key: string]: string } = {
        'Thompson': 'Thompson Library',
        '18th': '18th Avenue Library',
        'Arch': 'Architecture Library',
        'Arts': 'Fine Arts Library'
      };

      const prefix = parts[0];
      const building = buildingMap[prefix] || prefix + ' Library';
      const floor = parseInt(parts[1].replace('F', ''));

      // Check if user has an active reservation
      const { data: existingReservation } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'occupied')
        .maybeSingle();

      if (existingReservation) {
        // If scanning the same seat, release it
        if (existingReservation.seat_id === seatId) {
          await supabase
            .from('reservations')
            .update({
              status: 'released',
              released_at: new Date().toISOString()
            })
            .eq('id', existingReservation.id);

          toast({
            title: 'Seat Released ✓',
            description: `${seatId} is now available for others.`,
          });

          navigate('/mobile');
          return;
        } else {
          toast({
            title: 'Already Have a Seat',
            description: `You already have ${existingReservation.seat_id}. Release it first.`,
            variant: 'destructive',
          });
          return;
        }
      }

      // Check if seat is already occupied by someone else
      const { data: seatOccupied } = await supabase
        .from('reservations')
        .select('*')
        .eq('seat_id', seatId)
        .eq('status', 'occupied')
        .maybeSingle();

      if (seatOccupied) {
        toast({
          title: 'Seat Occupied',
          description: 'This seat is currently occupied by someone else.',
          variant: 'destructive',
        });
        return;
      }

      // Create new reservation
      const { error } = await supabase
        .from('reservations')
        .insert({
          seat_id: seatId,
          building: building,
          floor: floor,
          user_id: user.id,
          user_name: user.email,
          status: 'occupied'
        });

      if (error) {
        console.error('Error creating reservation:', error);
        toast({
          title: 'Error',
          description: 'Failed to reserve seat. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Seat Reserved! 🎉',
        description: `You have reserved ${seatId}.`,
      });

      navigate('/mobile');
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to process QR code.',
        variant: 'destructive',
      });
    }
  };

  const onScanError = (error: any) => {
    // Ignore scan errors (they happen frequently)
    console.log('Scan error:', error);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">OSU Seat Finder</h1>
          <p className="text-muted-foreground mb-6">Please sign in to scan seats</p>
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
      <header className="bg-primary text-primary-foreground p-4 shadow-sm flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/mobile')}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src={osuLogo} alt="OSU Logo" className="h-14 w-14 object-contain" />
        <div>
          <h1 className="text-xl font-bold">Scan QR Code</h1>
          <p className="text-sm opacity-90">Point at seat QR code</p>
        </div>
      </header>

      <main className="p-4">
        <Card className="p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Scanning Instructions</h2>
              <p className="text-sm text-muted-foreground">
                Point camera at seat QR code
              </p>
            </div>
          </div>

          {/* QR Scanner */}
          <div id="qr-reader" className="w-full rounded-lg overflow-hidden"></div>
        </Card>

        <Card className="p-4 bg-muted/30 border-primary/20">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <span className="text-primary">💡</span>
            Usage Tips
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Keep phone steady, ensure sufficient lighting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>First scan = Occupy seat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Scan same code again = Release seat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Only one seat can be occupied at a time</span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default Scan;
