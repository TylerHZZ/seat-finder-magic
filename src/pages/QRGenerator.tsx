import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import osuLogo from '@/assets/osu-logo.png';

const QRGenerator = () => {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState('Thompson Library');
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [selectedSeat, setSelectedSeat] = useState('001');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const buildings = [
    'Thompson Library',
    '18th Avenue Library',
    'Architecture Library',
    'Fine Arts Library'
  ];

  const floors: { [key: string]: string[] } = {
    'Thompson Library': ['1', '2', '3', '4'],
    '18th Avenue Library': ['1', '2', '3'],
    'Architecture Library': ['1'],
    'Fine Arts Library': ['1']
  };

  const generateSeatId = () => {
    let prefix = selectedBuilding;
    if (selectedBuilding === 'Thompson Library') prefix = 'Thompson';
    if (selectedBuilding === '18th Avenue Library') prefix = '18th';
    if (selectedBuilding === 'Architecture Library') prefix = 'Arch';
    if (selectedBuilding === 'Fine Arts Library') prefix = 'Arts';
    
    return `${prefix}-${selectedFloor}F-${selectedSeat}`;
  };

  const generateQRCode = async () => {
    const seatId = generateSeatId();
    const qrData = JSON.stringify({
      seatId,
      building: selectedBuilding,
      floor: parseInt(selectedFloor)
    });

    try {
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#BB0000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [selectedBuilding, selectedFloor, selectedSeat]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `${generateSeatId()}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${generateSeatId()}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
                padding: 40px;
                border: 2px solid #BB0000;
                border-radius: 8px;
              }
              h1 { color: #BB0000; margin-bottom: 10px; }
              .seat-info { font-size: 24px; font-weight: bold; margin: 20px 0; }
              img { max-width: 400px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>OSU Library Navigator</h1>
              <div class="seat-info">${generateSeatId()}</div>
              <div style="margin: 10px 0;">${selectedBuilding} - Floor ${selectedFloor}</div>
              <img src="${qrDataUrl}" alt="QR Code" />
              <p style="margin-top: 20px; font-size: 14px;">Scan to occupy or release this seat</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={osuLogo} alt="OSU Logo" className="h-14 w-14 object-contain" />
            <div>
              <h1 className="text-xl font-bold">QR Code Generator</h1>
              <p className="text-sm text-muted-foreground">Generate test QR codes for seats</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Seat</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Building</label>
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Floor</label>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {floors[selectedBuilding].map((floor) => (
                    <SelectItem key={floor} value={floor}>
                      Floor {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Seat Number</label>
              <Select value={selectedSeat} onValueChange={setSelectedSeat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => String(i + 1).padStart(3, '0')).map((num) => (
                    <SelectItem key={num} value={num}>
                      Seat {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{generateSeatId()}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedBuilding} - Floor {selectedFloor}
            </p>
            
            {qrDataUrl && (
              <div className="bg-white p-6 rounded-lg inline-block mb-6 border-2 border-primary">
                <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 mx-auto" />
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={downloadQR} className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button onClick={printQR} variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Testing Instructions</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>Generate and print/display this QR code</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>Go to Mobile View and log in</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>Click "Scan QR Code" button</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>Point your camera at the QR code</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">5.</span>
              <span>First scan = Occupy seat | Second scan = Release seat</span>
            </li>
          </ol>
        </Card>

        <Card className="mt-6 p-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-3">Demo Flow</h3>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="p-3 bg-white rounded border border-yellow-200">
              <p className="font-semibold mb-1">🔍 Scan to Occupy</p>
              <p>Scan any available seat QR code → Seat becomes yours immediately → Shows on Mobile view</p>
            </div>
            <div className="p-3 bg-white rounded border border-yellow-200">
              <p className="font-semibold mb-1">⏰ Long Occupation Warning</p>
              <p>After 1.5 hours → Confirmation required → Click "Confirm Occupation" button</p>
            </div>
            <div className="p-3 bg-white rounded border border-yellow-200">
              <p className="font-semibold mb-1">🚪 Auto-Release</p>
              <p>If not confirmed within 2 hours → Seat automatically released → Notification shown</p>
            </div>
            <div className="p-3 bg-white rounded border border-yellow-200">
              <p className="font-semibold mb-1">✅ Manual Release</p>
              <p>Scan the same QR code again OR click "Release Seat" button → Seat becomes available</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default QRGenerator;
