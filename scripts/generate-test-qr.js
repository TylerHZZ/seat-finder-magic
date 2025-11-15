// Generate test QR code for development
import QRCode from 'qrcode';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test seat ID: Thompson Library, Floor 3, Seat 001
const seatId = 'Thompson-3F-001';

async function generateTestQR() {
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

    // Convert data URL to buffer
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save to public folder
    const outputPath = join(__dirname, '..', 'public', 'test-qr-code.png');
    writeFileSync(outputPath, buffer);

    console.log('✅ Test QR code generated successfully!');
    console.log(`📍 Location: public/test-qr-code.png`);
    console.log(`🎫 Seat ID: ${seatId}`);
    console.log(`📱 Access at: http://localhost:5173/test-qr-code.png`);
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

generateTestQR();
