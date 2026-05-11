import { Link } from "@tanstack/react-router";
import { Plane, Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/pricing", label: "Pricing" },
    { to: "/apply", label: "Apply" },
    { to: "/track", label: "Track" },
    { to: "/contact", label: "Contact" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full btn-gold flex items-center justify-center">
            <Plane className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl gold-text font-bold tracking-wide">MJ International</div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Tours & Travels</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to as any}
              className="text-sm uppercase tracking-widest text-foreground/80 hover:text-gold transition-colors relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-px after:bg-gold hover:after:w-full after:transition-all"
              activeProps={{ className: "text-gold" }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/apply" className="px-6 py-2.5 rounded-full btn-gold text-sm font-semibold uppercase tracking-wider">
            Book Journey
          </Link>
        </nav>
        <button className="md:hidden text-gold" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass border-t border-gold/10 px-6 py-6 space-y-4 animate-fade-in">
          {links.map((l) => (
            <Link key={l.to} to={l.to as any} onClick={() => setOpen(false)}
              className="block text-base uppercase tracking-widest text-foreground/90 hover:text-gold">
              {l.label}
            </Link>
          ))}
          <Link to="/apply" onClick={() => setOpen(false)}
            className="block text-center px-6 py-3 rounded-full btn-gold font-semibold uppercase tracking-wider">
            Book Journey
          </Link>
        </div>
      )}
    </header>
  );
}
