import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { HotelPresenter } from "@/presenters/HotelPresenter";
import { BookingPresenter } from "@/presenters/BookingPresenter";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { Hotel } from "@/models/HotelModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Star, MapPin, Calendar, Users } from "lucide-react";

const hotelPresenter = new HotelPresenter();
const bookingPresenter = new BookingPresenter();
const authPresenter = new AuthPresenter();

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [user, setUser] = useState<any>(null);

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = parseInt(searchParams.get("guests") || "1");

  useEffect(() => {
    loadHotel();
    checkUser();
  }, [id]);

  const checkUser = async () => {
    const { user } = await authPresenter.getCurrentUser();
    setUser(user);
  };

  const loadHotel = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const result = await hotelPresenter.getHotelDetails(id);
      setHotel(result);
    } catch (error: any) {
      toast.error(error.message);
      navigate("/hotels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book");
      navigate("/auth");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (!hotel) return;

    setIsBooking(true);
    try {
      const totalPrice = hotelPresenter.calculateTotalPrice(
        hotel.price_per_night,
        checkIn,
        checkOut
      );

      const newBooking = await bookingPresenter.createBooking({
        hotel_id: hotel.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        guests,
        total_price: totalPrice,
      });

      toast.success("Booking confirmed!");
      navigate(`/booking/${newBooking.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Hotel not found</p>
      </div>
    );
  }

  const totalPrice = checkIn && checkOut
    ? hotelPresenter.calculateTotalPrice(hotel.price_per_night, checkIn, checkOut)
    : 0;
  
  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src={hotel.image_url || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">{hotel.rating}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-lg mb-6">
                {hotel.description}
              </p>

              {hotel.amenities && hotel.amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm px-4 py-2">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {hotelPresenter.formatPrice(hotel.price_per_night)}
                  </p>
                  <p className="text-muted-foreground">per night</p>
                </div>

                {checkIn && checkOut && (
                  <>
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Check-in</span>
                        </div>
                        <span className="font-medium">{new Date(checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Check-out</span>
                        </div>
                        <span className="font-medium">{new Date(checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>Guests</span>
                        </div>
                        <span className="font-medium">{guests}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">
                          {hotelPresenter.formatPrice(hotel.price_per_night)} × {nights} nights
                        </span>
                        <span>{hotelPresenter.formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xl font-bold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-primary">{hotelPresenter.formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  variant="hero"
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={isBooking || !checkIn || !checkOut}
                >
                  {isBooking ? "Booking..." : "Book Now"}
                </Button>

                {(!checkIn || !checkOut) && (
                  <p className="text-sm text-muted-foreground text-center">
                    Select dates to see total price
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
