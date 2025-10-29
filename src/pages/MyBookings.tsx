import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingPresenter } from "@/presenters/BookingPresenter";
import { HotelPresenter } from "@/presenters/HotelPresenter";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { Booking } from "@/models/BookingModel";
import { Hotel } from "@/models/HotelModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Users, CreditCard } from "lucide-react";

const bookingPresenter = new BookingPresenter();
const hotelPresenter = new HotelPresenter();
const authPresenter = new AuthPresenter();

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Record<string, Hotel>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { user } = await authPresenter.getCurrentUser();
    if (!user) {
      toast.error("Please sign in to view bookings");
      navigate("/auth");
      return;
    }
    setUser(user);
    loadBookings();
  };

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const bookingsData = await bookingPresenter.loadUserBookings();
      setBookings(bookingsData);

      const hotelIds = [...new Set(bookingsData.map((b) => b.hotel_id))];
      const hotelDetails: Record<string, Hotel> = {};
      
      for (const hotelId of hotelIds) {
        try {
          const hotel = await hotelPresenter.getHotelDetails(hotelId);
          hotelDetails[hotelId] = hotel;
        } catch (error) {
          console.error(`Error loading hotel ${hotelId}:`, error);
        }
      }
      
      setHotels(hotelDetails);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getNights = (checkIn: string, checkOut: string) => {
    return Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground mb-6">
              You haven't made any bookings yet
            </p>
            <Button onClick={() => navigate("/hotels")}>
              Browse Hotels
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const hotel = hotels[booking.hotel_id];
              const nights = getNights(booking.check_in_date, booking.check_out_date);

              return (
                <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {hotel && (
                        <div className="md:w-64 h-48 md:h-auto">
                          <img
                            src={hotel.image_url || "/placeholder.svg"}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">
                              {hotel?.name || "Loading..."}
                            </h3>
                            {hotel && (
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{hotel.location}</span>
                              </div>
                            )}
                          </div>
                          <Badge variant={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>Check-in</span>
                            </div>
                            <p className="font-semibold">
                              {new Date(booking.check_in_date).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>Check-out</span>
                            </div>
                            <p className="font-semibold">
                              {new Date(booking.check_out_date).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Users className="w-4 h-4 mr-2" />
                              <span>Guests</span>
                            </div>
                            <p className="font-semibold">{booking.guests}</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-muted-foreground text-sm">
                              <CreditCard className="w-4 h-4 mr-2" />
                              <span>{nights} nights</span>
                            </div>
                            <p className="text-xl font-bold text-primary">
                              ₹{booking.total_price}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/booking/${booking.id}`)}
                          >
                            View Details
                          </Button>
                          {hotel && (
                            <Button
                              variant="ghost"
                              onClick={() => navigate(`/hotel/${hotel.id}`)}
                            >
                              View Hotel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
