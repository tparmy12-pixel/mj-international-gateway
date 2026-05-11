import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContacts } from "@/components/FloatingContacts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Crown, Sparkles, Globe2, Check, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Subscription Plans — MJ International Tours" },
      { name: "description", content: "Premium travel subscription plans: Unique, Infinity & Global. Pay via Paytm UPI." },
    ],
  }),
});

const PAY_UPI = "8279713106@paytm";
const PAY_NAME = "MJ International Tours";

const PLANS = [
  {
    key: "unique" as const, name: "Unique Travel", amount: 10000, icon: Sparkles,
    tag: "Starter",
    perks: ["1 visa application", "Standard processing", "Email support", "Document review"],
  },
  {
    key: "infinity" as const, name: "Infinity Travel", amount: 25000, icon: Crown,
    tag: "Most Popular", featured: true,
    perks: ["Up to 5 applications", "Priority processing", "WhatsApp + Email support", "Free hotel quotes", "Dedicated agent"],
  },
  {
    key: "global" as const, name: "Global Travel", amount: 50000, icon: Globe2,
    tag: "Elite",
    perks: ["Unlimited applications", "VIP fast-track", "24/7 concierge", "Free flight quotes", "Insurance included", "Family plans"],
  },
];

function Pricing() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);

  async function buy(plan: typeof PLANS[number]) {
    setBusy(plan.key);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.info("Please sign in to continue");
        navigate({ to: "/auth" });
        return;
      }
      const { error } = await supabase.from("subscriptions").insert({
        user_id: session.user.id,
        plan: plan.key,
        amount: plan.amount,
        payment_status: "pending",
      });
      if (error) throw error;
      const upi = `upi://pay?pa=${PAY_UPI}&pn=${encodeURIComponent(PAY_NAME)}&am=${plan.amount}&cu=INR&tn=${encodeURIComponent(plan.name + " Subscription")}`;
      toast.success("Opening Paytm / UPI app… Complete payment to activate.");
      window.location.href = upi;
    } catch (err: any) {
      toast.error(err.message || "Could not start payment");
    } finally { setBusy(null); }
  }

  return (
    <div className="min-h-screen">
      <Navbar /><FloatingContacts />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Subscription Plans</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold">Choose Your <span className="gold-text">Journey</span></h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Premium travel subscriptions. Pay securely via Paytm UPI to <span className="text-gold font-semibold">{PAY_UPI}</span>.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((p) => (
              <div key={p.key}
                className={`luxury-card p-8 relative overflow-hidden ${p.featured ? "ring-2 ring-gold shadow-[0_0_60px_-15px_rgba(212,175,55,0.5)] scale-[1.02]" : ""}`}>
                {p.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold text-navy-deep text-[10px] font-bold uppercase tracking-widest">
                    {p.tag}
                  </div>
                )}
                <p.icon className="w-10 h-10 text-gold mb-4" />
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                {!p.featured && <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{p.tag}</p>}
                <div className="mt-6 mb-6">
                  <span className="font-display text-5xl font-bold gold-text">₹{p.amount.toLocaleString("en-IN")}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <span className="text-foreground/85">{perk}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => buy(p)} disabled={busy === p.key}
                  className={`w-full px-6 py-3 rounded-full font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all
                    ${p.featured ? "btn-gold" : "border-2 border-gold/40 text-gold hover:bg-gold/10"}`}>
                  {busy === p.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe via Paytm</>}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-10">
            After payment, your subscription is verified manually within 24 hours. Save the UPI transaction ID for reference.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
