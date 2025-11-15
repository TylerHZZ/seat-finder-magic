import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestSeat {
  id: string;
  building: string;
  floor: string;
  seat: string;
}

export default function TestQR() {
  const navigate = useNavigate();
  const [qrCodes, setQrCodes] = useState<{ seatId: string; dataUrl: string }[]>([]);
  
  const testSeats: TestSeat[] = [
    { id: 'Thompson-3F-001', building: 'Thompson Library', floor: '3F', seat: '001' },
    { id: 'Thompson-2F-015', building: 'Thompson Library', floor: '2F', seat: '015' },
    { id: '18th-1F-008', building: '18th Avenue Library', floor: '1F', seat: '008' },
    { id: 'Architecture-2F-005', building: 'Architecture Library', floor: '2F', seat: '005' },
    { id: 'FineArts-1F-012', building: 'Fine Arts Library', floor: '1F', seat: '012' },
  ];

  useEffect(() => {
    generateAllQRCodes();
  }, []);

  const generateAllQRCodes = async () => {
    try {
      const codes = await Promise.all(
        testSeats.map(async (seat) => {
          const dataUrl = await QRCode.toDataURL(seat.id, {
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'H',
            color: {
              dark: '#BB0000',
              light: '#FFFFFF'
            }
          });
          return { seatId: seat.id, dataUrl };
        })
      );
      setQrCodes(codes);
    } catch (error) {
      console.error('Error generating QR codes:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Test QR Codes</h1>
          <p className="text-muted-foreground">Five test QR codes for different library seats</p>
        </div>

        {qrCodes.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">Loading QR codes...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {testSeats.map((seat) => {
                const qrCode = qrCodes.find(qr => qr.seatId === seat.id);
                return (
                  <Card key={seat.id} className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground">{seat.building}</h3>
                        <p className="text-sm text-muted-foreground">Floor {seat.floor} - Seat {seat.seat}</p>
                      </div>
                      
                      {qrCode && (
                        <div className="bg-white p-4 rounded-lg flex justify-center">
                          <img 
                            src={qrCode.dataUrl} 
                            alt={`QR Code for ${seat.id}`}
                            className="w-48 h-48"
                          />
                        </div>
                      )}
                      
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs font-mono text-center text-muted-foreground">{seat.id}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Use the Scan page to scan any of these QR codes
              </p>
              <Button 
                onClick={() => navigate('/scan')}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Go to Scan Page
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
