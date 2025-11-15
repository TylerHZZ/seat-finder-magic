import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TestQR() {
  const navigate = useNavigate();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const seatId = 'Thompson-3F-001';

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(seatId, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#BB0000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Test QR Code</h1>
              <p className="text-muted-foreground">Scan to reserve seat</p>
            </div>

            <div className="bg-white p-8 rounded-lg inline-block">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Test QR Code" 
                  className="w-80 h-80"
                />
              ) : (
                <div className="w-80 h-80 flex items-center justify-center">
                  <p>Loading...</p>
                </div>
              )}
            </div>

            <div className="space-y-2 text-left bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-foreground">Seat Information:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Building: Thompson Library</li>
                <li>• Floor: 3F</li>
                <li>• Seat: 001</li>
                <li>• Seat ID: {seatId}</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Use the Scan page to scan this QR code and reserve the seat
              </p>
              <Button 
                onClick={() => navigate('/scan')}
                className="mt-4 w-full bg-primary hover:bg-primary/90"
              >
                Go to Scan Page
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
