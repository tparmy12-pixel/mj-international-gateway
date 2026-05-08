import { Phone, MessageCircle } from "lucide-react";

export function FloatingContacts() {
  const phone = "+919876543210";
  const wa = "919876543210";
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-float"
        style={{ background: "#25D366" }} aria-label="WhatsApp">
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
      <a href={`tel:${phone}`}
        className="w-14 h-14 rounded-full btn-gold flex items-center justify-center" aria-label="Call now">
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
