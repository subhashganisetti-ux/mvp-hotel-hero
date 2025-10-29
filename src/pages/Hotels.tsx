import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HotelPresenter } from "@/presenters/HotelPresenter";
import { Hotel } from "@/models/HotelModel";
import { HotelCard } from "@/components/HotelCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import WhatsAppChat from "@/components/WhatsAppChat";

const hotelPresenter = new HotelPresenter();

const Hotels = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const city = searchParams.get("city") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "1";

  useEffect(() => {
    loadHotels();
  }, [city]);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const result = city
        ? await hotelPresenter.searchHotels({ city })
        : await hotelPresenter.loadAllHotels();
      setHotels(result);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (params: any) => {
    const searchParams = new URLSearchParams({
      city: params.city,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: params.guests.toString(),
    });
    navigate(`/hotels?${searchParams.toString()}`);
  };

  const handleViewDetails = (hotelId: string) => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
    });
    navigate(`/hotel/${hotelId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold mb-6">Find Your Perfect Stay</h1>
          <SearchBar
            onSearch={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No hotels found. Try adjusting your search.
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Found {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"}
              {city && ` in ${city}`}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <WhatsAppChat />
    </div>
  );
};

export default Hotels;
