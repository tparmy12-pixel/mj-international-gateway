import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContacts } from "@/components/FloatingContacts";
import { SERVICES } from "@/lib/services-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Our Services — MJ International Tours" },
      { name: "description", content: "Umrah, Haj, Tourist Visa, Work Visa, Family Visit Visa, International Tours, Hotel & Flight Booking, Passport Assistance, Travel Insurance." },
    ],
  }),
});

function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingContacts />
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Our Expertise</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold">
              Premium <span className="gold-text">Travel Services</span>
            </h1>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.key} className="luxury-card p-8">
                <div className="w-16 h-16 rounded-2xl btn-gold flex items-center justify-center mb-6">
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{s.desc}</p>
                <Link to="/apply" className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest hover:gap-3 transition-all">
                  Apply <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
