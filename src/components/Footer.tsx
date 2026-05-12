import { Link } from "@tanstack/react-router";
import { Plane, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold/15 mt-20" style={{ background: "linear-gradient(180deg, transparent, oklch(0.10 0.04 265))" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full btn-gold flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-2xl gold-text font-bold">MJ International</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Tours & Travels</div>
            </div>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Your trusted partner for international travel — from sacred Umrah & Haj journeys
            to luxury world tours, premium visas and seamless bookings.
          </p>
        </div>
        <div>
          <h4 className="text-gold uppercase text-xs tracking-[0.3em] mb-4">Explore</h4>
          <ul className="space-y-2 text-foreground/80">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/apply" className="hover:text-gold">Apply</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/admin/login" className="hover:text-gold">Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold uppercase text-xs tracking-[0.3em] mb-4">Reach Us</h4>
          <ul className="space-y-3 text-foreground/80 text-sm">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 text-gold mt-0.5"/> +91 98765 43210</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 text-gold mt-0.5"/> info@mjinternational.com</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold mt-0.5"/> Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/10 py-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        © {new Date().getFullYear()} MJ International Tours — Crafted with luxury
      </div>
    </footer>
  );
}
