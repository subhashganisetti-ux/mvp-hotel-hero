import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookingPresenter } from "@/presenters/BookingPresenter";
import { HotelPresenter } from "@/presenters/HotelPresenter";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { Booking } from "@/models/BookingModel";
import { Hotel } from "@/models/HotelModel";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const bookingPresenter = new BookingPresenter();
const hotelPresenter = new HotelPresenter();
const authPresenter = new AuthPresenter();

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserAndLoadBooking();
  }, [id]);

  const checkUserAndLoadBooking = async () => {
    const { user } = await authPresenter.getCurrentUser();
    if (!user) {
      toast.error("Please sign in to view booking details");
      navigate("/auth");
      return;
    }
    loadBooking();
  };

  const loadBooking = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const bookings = await bookingPresenter.loadUserBookings();
      const currentBooking = bookings.find((b) => b.id === id);

      if (!currentBooking) {
        toast.error("Booking not found");
        navigate("/my-bookings");
        return;
      }

      setBooking(currentBooking);

      const hotelData = await hotelPresenter.getHotelDetails(currentBooking.hotel_id);
      setHotel(hotelData);
    } catch (error: any) {
      toast.error(error.message);
      navigate("/my-bookings");
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/my-bookings")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Bookings
        </Button>

        <BookingConfirmation booking={booking} hotel={hotel} />

        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => window.print()}>
            Print Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
