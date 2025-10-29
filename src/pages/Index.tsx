import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import WhatsAppChat from "@/components/WhatsAppChat";

const authPresenter = new AuthPresenter();

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current user
    const checkUser = async () => {
      const { user } = await authPresenter.getCurrentUser();
      setUser(user);
    };
    checkUser();

    // Set up auth listener
    const { data: { subscription } } = authPresenter.setupAuthListener((user) => {
      setUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (params: any) => {
    const searchParams = new URLSearchParams({
      city: params.city,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guests: params.guests.toString(),
    });
    navigate(`/hotels?${searchParams.toString()}`);
  };

  const handleSignOut = async () => {
    await authPresenter.handleSignOut();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-primary min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white">StayBook</h1>
            </div>
            
            <div className="flex gap-4">
              {user ? (
                <>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary" onClick={() => navigate("/my-bookings")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </Button>
                  <Button variant="secondary" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={() => navigate("/auth")}>
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect Stay
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Discover amazing hotels and book your dream vacation with ease
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-2">Best Hotels</h3>
            <p className="text-muted-foreground">
              Handpicked selection of premium hotels worldwide
            </p>
          </div>

          <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-2">Best Prices</h3>
            <p className="text-muted-foreground">
              Competitive rates and exclusive deals for you
            </p>
          </div>

          <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
            <p className="text-muted-foreground">
              Safe and secure payment with instant confirmation
            </p>
          </div>
        </div>
      </div>

      <WhatsAppChat />
    </div>
  );
};

export default Index;
