import { Star, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hotel } from "@/models/HotelModel";

interface HotelCardProps {
  hotel: Hotel;
  onViewDetails: (id: string) => void;
}

export const HotelCard = ({ hotel, onViewDetails }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image_url || "/placeholder.svg"}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-semibold">{hotel.rating}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{hotel.location}</span>
        </div>
        
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {hotel.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold text-primary">
            ₹{hotel.price_per_night}
          </p>
          <p className="text-xs text-muted-foreground">per night</p>
        </div>
        <Button onClick={() => onViewDetails(hotel.id)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
