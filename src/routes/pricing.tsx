import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContacts } from "@/components/FloatingContacts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Crown, Sparkles, Globe2, Check, Loader2, Copy, X } from "lucide-react";
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

const PAY_NUMBER = "8279971306";
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
  const [activePlan, setActivePlan] = useState<typeof PLANS[number] | null>(null);
  const [txnId, setTxnId] = useState("");
  const [payerName, setPayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function startBuy(plan: typeof PLANS[number]) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { toast.info("Please sign in to continue"); navigate({ to: "/auth" }); return; }
    setActivePlan(plan); setTxnId(""); setPayerName("");
  }

  async function copyNumber() {
    try { await navigator.clipboard.writeText(PAY_NUMBER); toast.success("Number copied"); }
    catch { toast.error("Copy failed"); }
  }

  async function submitPayment() {
    if (!activePlan) return;
    if (!txnId.trim() || !payerName.trim()) { toast.error("Enter Transaction ID and Name"); return; }
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sign in required");
      const { error } = await supabase.from("subscriptions").insert({
        user_id: session.user.id,
        plan: activePlan.key,
        amount: activePlan.amount,
        payment_status: "pending",
        transaction_id: txnId.trim(),
        payer_name: payerName.trim(),
      } as never);
      if (error) throw error;
      toast.success("Payment submitted! Verification within 24 hours.");
      setActivePlan(null);
    } catch (e: any) { toast.error(e.message || "Submission failed"); }
    finally { setSubmitting(false); }
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
              Premium travel subscriptions. Pay manually via Paytm / UPI / GPay / PhonePe to <span className="text-gold font-semibold">{PAY_NUMBER}</span>.
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
                <button onClick={() => startBuy(p)}
                  className={`w-full px-6 py-3 rounded-full font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all
                    ${p.featured ? "btn-gold" : "border-2 border-gold/40 text-gold hover:bg-gold/10"}`}>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-10">
            After payment, your subscription is verified manually within 24 hours. Save your UPI transaction ID for reference.
          </p>
        </div>
      </section>

      {activePlan && (
        <div className="fixed inset-0 z-50 bg-navy-deep/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !submitting && setActivePlan(null)}>
          <div className="luxury-card w-full max-w-md p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gold/15 flex items-center justify-between glass">
              <h3 className="font-display text-lg gold-text font-bold">Pay ₹{activePlan.amount.toLocaleString("en-IN")}</h3>
              <button onClick={() => !submitting && setActivePlan(null)} className="p-1.5 rounded-md hover:bg-gold/10"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Pay to this Paytm / UPI number</label>
                <div className="mt-2 flex items-center gap-2 p-3 rounded-lg bg-input/50 border border-gold/30">
                  <span className="font-display text-2xl gold-text font-bold tracking-wide flex-1">{PAY_NUMBER}</span>
                  <button onClick={copyNumber} className="p-2 rounded-md btn-gold" title="Copy number">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Open Paytm / GPay / PhonePe → Send ₹{activePlan.amount.toLocaleString("en-IN")} to <span className="text-gold">{PAY_NAME}</span> on this number.</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Transaction ID / UTR</label>
                <input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="e.g. 4123567890XYZ"
                  className="w-full mt-2 px-3 py-2.5 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Name on Payment</label>
                <input value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="Your full name as per payment app"
                  className="w-full mt-2 px-3 py-2.5 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none text-sm" />
              </div>
              <button onClick={submitPayment} disabled={submitting}
                className="w-full px-6 py-3 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
