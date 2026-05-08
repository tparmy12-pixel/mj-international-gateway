import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContacts } from "@/components/FloatingContacts";
import { SERVICES } from "@/lib/services-data";
import { Star, Quote, ArrowRight, Plane, Award, Globe2, Users, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({ component: Home });

const REVIEWS = [
  { name: "Mohammed Ansari", country: "Umrah · Saudi Arabia", text: "Flawless Umrah package — VIP transport, 5-star hotel near Haram. MJ team handled every detail.", rating: 5 },
  { name: "Priya Sharma", country: "Tour · Turkey", text: "An unforgettable Cappadocia honeymoon. Booking, visa, hotels — everything was premium.", rating: 5 },
  { name: "Rahul Kapoor", country: "Visa · USA", text: "Got my US tourist visa in record time. Truly trustworthy and professional service.", rating: 5 },
  { name: "Aisha Khan", country: "Family Visa · UAE", text: "Reunited with my husband in Dubai thanks to MJ. Documentation was perfect.", rating: 5 },
];

const COUNTRIES = ["Saudi Arabia", "Dubai", "Turkey", "USA", "Malaysia", "Singapore", "UK", "Switzerland", "Indonesia", "Qatar"];

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingContacts />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={hero} alt="World landmarks" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.05 265 / 0.55), oklch(0.10 0.05 265 / 0.85) 70%, oklch(0.10 0.05 265) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs uppercase tracking-[0.4em] text-gold">Since 2010 · 50,000+ Travelers</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] animate-fade-up">
            Trusted <span className="gold-text">International</span><br />
            Travel Services
          </h1>
          <p className="mt-8 text-lg md:text-2xl text-foreground/85 font-light max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "150ms" }}>
            Visa · Hotel · Flight & Full Tour Packages — crafted with luxury, delivered with care.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Link to="/apply" className="px-8 py-4 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2 group">
              Start Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
              className="px-8 py-4 rounded-full glass gold-border font-semibold uppercase tracking-widest text-sm text-gold hover:bg-gold/10 transition-colors">
              Chat on WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "450ms" }}>
            {[
              { v: "50K+", l: "Happy Travelers", i: Users },
              { v: "90+", l: "Countries", i: Globe2 },
              { v: "15+", l: "Years Experience", i: Award },
              { v: "100%", l: "Trusted Service", i: ShieldCheck },
            ].map((s) => (
              <div key={s.l} className="luxury-card p-6 text-center">
                <s.i className="w-6 h-6 text-gold mx-auto mb-3" />
                <div className="font-display text-3xl gold-text font-bold">{s.v}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS MARQUEE */}
      <section className="py-12 border-y border-gold/10 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
            <span key={i} className="mx-12 font-display text-3xl md:text-5xl text-foreground/30 hover:text-gold transition-colors flex items-center gap-12">
              {c} <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">What We Offer</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold">
              Premium <span className="gold-text">Travel Services</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Everything you need for international travel — under one roof, with luxury attention to detail.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {SERVICES.map((s, i) => (
              <div key={s.key} className="luxury-card p-7 group" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-14 h-14 rounded-2xl btn-gold flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm">
              Apply for Any Service <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section-pad" style={{ background: "oklch(0.14 0.04 265)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Around The World</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold">
              Iconic <span className="gold-text">Destinations</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: g1, label: "Mecca, Saudi Arabia" },
              { src: g2, label: "Dubai, UAE" },
              { src: g3, label: "Istanbul, Turkey" },
              { src: g4, label: "Kuala Lumpur, Malaysia" },
              { src: g5, label: "New York, USA" },
              { src: g6, label: "Madinah, Saudi Arabia" },
            ].map((g, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl gold-border group ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <img src={g.src} alt={g.label} loading="lazy" width={1024} height={1024}
                  className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="text-xs uppercase tracking-[0.3em] text-gold">Featured</div>
                  <div className="font-display text-xl md:text-2xl text-white">{g.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-pad">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Voices of Trust</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold">
              What Our <span className="gold-text">Travelers Say</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="luxury-card p-7">
                <Quote className="w-8 h-8 text-gold/60 mb-4" />
                <p className="text-foreground/90 leading-relaxed text-sm">{r.text}</p>
                <div className="flex gap-1 mt-5">
                  {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="w-4 h-4 fill-gold text-gold" />)}
                </div>
                <div className="mt-5 pt-5 border-t border-gold/15">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{r.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="max-w-5xl mx-auto luxury-card p-12 md:p-20 text-center relative overflow-hidden">
          <Plane className="absolute -top-10 -right-10 w-64 h-64 text-gold/5 -rotate-45" />
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Ready When You Are</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            Begin Your <span className="gold-text">Luxury Journey</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
            Submit a single application — our team will reach out within 24 hours with a tailored quote.
          </p>
          <Link to="/apply" className="mt-10 inline-flex px-10 py-5 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm">
            Apply Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
