import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookingPresenter } from "@/presenters/BookingPresenter";
import { HotelPresenter } from "@/presenters/HotelPresenter";
import { BookingQRCode } from "@/components/BookingQRCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { toast } from "sonner";

const bookingPresenter = new BookingPresenter();
const hotelPresenter = new HotelPresenter();

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [hotel, setHotel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookingDetails();
  }, [id]);

  const loadBookingDetails = async () => {
    if (!id) {
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      const bookings = await bookingPresenter.loadUserBookings();
      const currentBooking = bookings.find((b) => b.id === id);
      
      if (!currentBooking) {
        toast.error("Booking not found");
        navigate("/");
        return;
      }

      setBooking(currentBooking);

      // Load hotel details
      const hotelDetails = await hotelPresenter.getHotelDetails(currentBooking.hotel_id);
      setHotel(hotelDetails);
    } catch (error: any) {
      toast.error(error.message);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking || !hotel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-white/90">
                Your reservation has been successfully completed
              </p>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{hotel.name}</h3>
                <p className="text-muted-foreground">{hotel.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-semibold">
                    {new Date(booking.check_in_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-semibold">
                    {new Date(booking.check_out_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-semibold">{booking.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{booking.status}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount Paid</span>
                  <span className="text-2xl font-bold text-primary">
                    {hotelPresenter.formatPrice(booking.total_price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <BookingQRCode
            booking={{
              id: booking.id,
              hotel_name: hotel.name,
              hotel_location: hotel.location,
              check_in_date: booking.check_in_date,
              check_out_date: booking.check_out_date,
              guests: booking.guests,
              total_price: booking.total_price,
            }}
          />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/my-bookings")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Bookings
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
