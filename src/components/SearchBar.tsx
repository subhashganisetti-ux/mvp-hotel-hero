import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const POPULAR_CITIES = [
  "Goa",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Jaipur",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Udaipur"
];

interface SearchBarProps {
  onSearch: (params: {
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city, checkIn, checkOut, guests });
  };

  return (
    <Card className="p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground z-10 pointer-events-none" />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {POPULAR_CITIES.map((cityName) => (
                <SelectItem key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex-1 relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-32 relative">
          <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="pl-10"
          />
        </div>
        
        <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>
    </Card>
  );
};
