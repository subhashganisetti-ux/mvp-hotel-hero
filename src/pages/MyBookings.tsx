import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingPresenter } from "@/presenters/BookingPresenter";
import { HotelPresenter } from "@/presenters/HotelPresenter";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Users, Eye } from "lucide-react";

const bookingPresenter = new BookingPresenter();
const hotelPresenter = new HotelPresenter();
const authPresenter = new AuthPresenter();

interface BookingWithHotel {
  booking: any;
  hotel: any;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookingsWithHotels, setBookingsWithHotels] = useState<BookingWithHotel[]>([]);
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
      const bookings = await bookingPresenter.loadUserBookings();
      
      // Load hotel details for each booking
      const bookingsWithHotelData = await Promise.all(
        bookings.map(async (booking) => {
          const hotel = await hotelPresenter.getHotelDetails(booking.hotel_id);
          return { booking, hotel };
        })
      );
      
      setBookingsWithHotels(bookingsWithHotelData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your bookings...</p>
      </div>
    );
  }

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

        {bookingsWithHotels.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-xl text-muted-foreground mb-4">
                You don't have any bookings yet
              </p>
              <Button variant="hero" onClick={() => navigate("/hotels")}>
                Browse Hotels
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookingsWithHotels.map(({ booking, hotel }) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative h-48 md:h-auto">
                    <img
                      src={hotel.image_url || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className={`absolute top-4 right-4 ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div className="md:col-span-3 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Check-in</p>
                            <p className="font-semibold">
                              {new Date(booking.check_in_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Check-out</p>
                            <p className="font-semibold">
                              {new Date(booking.check_out_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Guests</p>
                            <p className="font-semibold">{booking.guests}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Price</p>
                        <p className="text-2xl font-bold text-primary">
                          {hotelPresenter.formatPrice(booking.total_price)}
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(`/booking/${booking.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
