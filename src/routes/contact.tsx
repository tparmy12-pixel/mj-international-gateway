import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact MJ International Tours" },
      { name: "description", content: "Reach our travel experts 24/7 — phone, WhatsApp, email." },
    ],
  }),
});

function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Get in touch</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold">Let's <span className="gold-text">Talk Travel</span></h1>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Mail, title: "Email", value: "info@mjinternational.com", href: "mailto:info@mjinternational.com" },
              { icon: MapPin, title: "Office", value: "Mumbai, Maharashtra, India" },
              { icon: Clock, title: "Hours", value: "Mon–Sat · 10:00 AM – 8:00 PM" },
            ].map((c) => {
              const Wrap: any = c.href ? "a" : "div";
              return (
                <Wrap key={c.title} href={c.href} target={c.href?.startsWith("http") ? "_blank" : undefined}
                  className="luxury-card p-8 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl btn-gold flex items-center justify-center shrink-0"><c.icon className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-gold">{c.title}</div>
                    <div className="font-display text-xl mt-1">{c.value}</div>
                  </div>
                </Wrap>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
