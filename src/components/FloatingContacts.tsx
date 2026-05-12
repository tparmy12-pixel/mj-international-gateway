import { Phone } from "lucide-react";

export function FloatingContacts() {
  const phone = "+919876543210";
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a href={`tel:${phone}`}
        className="w-14 h-14 rounded-full btn-gold flex items-center justify-center animate-float shadow-lg" aria-label="Call now">
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
