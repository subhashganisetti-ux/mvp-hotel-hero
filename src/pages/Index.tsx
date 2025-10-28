import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Hotel, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

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
              <Hotel className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">StayBook</h1>
            </div>
            
            <div className="flex gap-4">
              {user ? (
                <>
                  <Button variant="secondary" onClick={() => navigate("/my-bookings")}>
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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hotel className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Best Hotels</h3>
            <p className="text-muted-foreground">
              Handpicked selection of premium hotels worldwide
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Best Prices</h3>
            <p className="text-muted-foreground">
              Competitive rates and exclusive deals for you
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
            <p className="text-muted-foreground">
              Safe and secure payment with instant confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
