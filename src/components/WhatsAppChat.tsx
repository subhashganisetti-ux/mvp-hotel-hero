import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppChat = () => {
  const phoneNumber = "918639231446";
  const defaultMessage = "Hi, I would like to enquire about hotel bookings on StayBook.";
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className="rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#25D366] hover:bg-[#20BD5A] text-white"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    </div>
  );
};

export default WhatsAppChat;
