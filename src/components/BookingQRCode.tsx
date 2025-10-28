import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign, Hash } from "lucide-react";

interface BookingQRCodeProps {
  booking: {
    id: string;
    hotel_name: string;
    hotel_location: string;
    check_in_date: string;
    check_out_date: string;
    guests: number;
    total_price: number;
  };
}

export const BookingQRCode = ({ booking }: BookingQRCodeProps) => {
  const bookingData = JSON.stringify({
    bookingId: booking.id,
    hotel: booking.hotel_name,
    location: booking.hotel_location,
    checkIn: booking.check_in_date,
    checkOut: booking.check_out_date,
    guests: booking.guests,
    totalPrice: booking.total_price,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center p-6 bg-white rounded-lg">
          <QRCodeSVG
            value={bookingData}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Booking ID:</span>
            <span className="font-mono font-semibold">{booking.id.substring(0, 8)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Hotel:</span>
            <span className="font-semibold">{booking.hotel_name}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Check-in:</span>
            <span className="font-semibold">
              {new Date(booking.check_in_date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Check-out:</span>
            <span className="font-semibold">
              {new Date(booking.check_out_date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Guests:</span>
            <span className="font-semibold">{booking.guests}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total Price:</span>
            <span className="font-semibold text-primary">${booking.total_price}</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Scan this QR code at the hotel for quick check-in
        </p>
      </CardContent>
    </Card>
  );
};
