import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Calendar, Users, CreditCard } from "lucide-react";
import { Booking } from "@/models/BookingModel";
import { Hotel } from "@/models/HotelModel";

interface BookingConfirmationProps {
  booking: Booking;
  hotel: Hotel;
}

export const BookingConfirmation = ({ booking, hotel }: BookingConfirmationProps) => {
  const bookingData = JSON.stringify({
    bookingId: booking.id,
    hotel: hotel.name,
    location: hotel.location,
    checkIn: booking.check_in_date,
    checkOut: booking.check_out_date,
    guests: booking.guests,
    totalPrice: booking.total_price,
    status: booking.status,
  });

  const nights = Math.ceil(
    (new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
        <p className="text-muted-foreground">Your reservation is confirmed</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-center p-6 bg-white dark:bg-background rounded-lg">
          <QRCodeSVG value={bookingData} size={200} level="H" />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
          <p className="font-mono font-bold text-lg">{booking.id.slice(0, 8).toUpperCase()}</p>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div>
            <h3 className="font-bold text-xl mb-2">{hotel.name}</h3>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{hotel.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Check-in</span>
              </div>
              <p className="font-semibold">{new Date(booking.check_in_date).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Check-out</span>
              </div>
              <p className="font-semibold">{new Date(booking.check_out_date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>Guests</span>
              </div>
              <p className="font-semibold">{booking.guests}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Nights</span>
              </div>
              <p className="font-semibold">{nights}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-muted-foreground">
                <CreditCard className="w-4 h-4 mr-2" />
                <span>Total Amount</span>
              </div>
              <p className="text-2xl font-bold text-primary">${booking.total_price}</p>
            </div>
            <Badge variant="secondary" className="w-full justify-center py-2">
              Status: {booking.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t text-sm text-muted-foreground text-center">
          <p>Present this QR code at check-in</p>
          <p>A confirmation email has been sent to your registered email</p>
        </div>
      </CardContent>
    </Card>
  );
};
