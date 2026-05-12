import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContacts } from "@/components/FloatingContacts";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2, XCircle, Clock, Loader2, Crown, LogOut, Plus, MapPin, Receipt, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/track")({
  component: TrackPage,
  head: () => ({ meta: [{ title: "My Applications — MJ International Tours" }] }),
});

type App = any;

function TrackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<App[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [orderApp, setOrderApp] = useState<App | null>(null);
  const [userEmail, setUserEmail] = useState("");

  async function load(userId: string) {
    const [{ data: a }, { data: s }] = await Promise.all([
      supabase.from("applications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    setApps(a || []); setSubs(s || []);
  }

  useEffect(() => {
    let unsub: any;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/auth" }); return; }
      setUserEmail(session.user.email || "");
      await load(session.user.id);
      setLoading(false);

      const channel = supabase.channel("user-apps")
        .on("postgres_changes", {
          event: "*", schema: "public", table: "applications", filter: `user_id=eq.${session.user.id}`,
        }, () => load(session.user.id))
        .subscribe();
      unsub = () => supabase.removeChannel(channel);
    })();
    return () => unsub?.();
  }, [navigate]);

  async function logout() { await supabase.auth.signOut(); navigate({ to: "/" }); }

  async function deleteRejected(id: string) {
    if (!confirm("Delete this rejected application so you can re-apply?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Removed. You can submit a new application.");
    setApps((p) => p.filter((x) => x.id !== id));
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar /><FloatingContacts />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gold mb-2">Customer Portal</p>
              <h1 className="font-display text-3xl md:text-5xl font-bold flex items-center gap-3 flex-wrap">
                My <span className="gold-text">Applications</span>
                {subs.some((s) => s.payment_status === "paid") && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-widest bg-gold/15 text-gold border border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                    <Crown className="w-3.5 h-3.5" /> VIP Member
                  </span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">{userEmail}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/apply" className="px-5 py-2.5 rounded-full btn-gold text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Application
              </Link>
              <button onClick={logout} className="px-4 py-2.5 rounded-full border border-border hover:border-gold/40 text-sm flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>

          {subs.length > 0 && (
            <div className="luxury-card p-6 mb-8">
              <h2 className="text-xs uppercase tracking-[0.3em] text-gold mb-4 flex items-center gap-2">
                <Crown className="w-4 h-4" /> Subscriptions
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subs.map((s) => (
                  <div key={s.id} className="rounded-xl border border-gold/15 p-4 bg-navy-deep/30">
                    <div className="font-display text-lg gold-text capitalize">{s.plan} Travel</div>
                    <div className="text-sm text-muted-foreground">₹{s.amount.toLocaleString("en-IN")}</div>
                    <div className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border
                      ${s.payment_status === "paid" ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
                        : "border-amber-400/40 text-amber-300 bg-amber-500/10"}`}>
                      {s.payment_status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {apps.length === 0 ? (
            <div className="luxury-card p-12 text-center">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
              <h2 className="font-display text-2xl mb-2">No applications yet</h2>
              <p className="text-muted-foreground mb-6">Submit your first travel application to get started.</p>
              <Link to="/apply" className="inline-block px-8 py-3 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm">
                Apply Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {apps.map((a) => (
                <AppCard key={a.id} app={a} onCreateOrder={() => setOrderApp(a)} onReapply={() => deleteRejected(a.id)} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      {orderApp && <OrderModal app={orderApp} onClose={() => setOrderApp(null)} onDone={() => { setOrderApp(null); }} />}
    </div>
  );
}

function AppCard({ app, onCreateOrder, onReapply }: { app: App; onCreateOrder: () => void; onReapply: () => void }) {
  const status = app.status as string;
  const order = app.order_status as string;

  const statusUI = {
    pending: { icon: Clock, color: "text-amber-300 bg-amber-500/10 border-amber-400/40",
      title: "Check your data — pending", msg: "Our team is reviewing your application. You'll be notified once accepted." },
    processing: { icon: Loader2, color: "text-blue-300 bg-blue-500/10 border-blue-400/40",
      title: "In review", msg: "Your documents are being verified." },
    approved: { icon: CheckCircle2, color: "text-emerald-300 bg-emerald-500/10 border-emerald-400/40",
      title: "🎉 Congratulations! Your data is successfully checked", msg: "Click below to create your order with delivery details." },
    rejected: { icon: XCircle, color: "text-red-300 bg-red-500/10 border-red-400/40",
      title: "Sorry, your data is not approved", msg: "Please remove this application and try again with corrected details." },
    completed: { icon: Crown, color: "text-purple-300 bg-purple-500/10 border-purple-400/40",
      title: "Completed", msg: "All done. Safe travels!" },
  }[status] || { icon: Clock, color: "text-muted-foreground bg-muted/10 border-border", title: status, msg: "" };

  const Icon = statusUI.icon;

  return (
    <div className="luxury-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="font-display text-xl flex items-center gap-2">
            {app.is_vip && <Crown className="w-4 h-4 text-gold" />}
            {app.full_name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {app.country || "Destination TBD"} · {(app.services || []).slice(0, 2).join(", ") || "—"}
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-1">
            Submitted {new Date(app.created_at).toLocaleString()}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border ${statusUI.color}`}>
          {status}
        </span>
      </div>

      <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${statusUI.color}`}>
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${status === "processing" ? "animate-spin" : ""}`} />
        <div>
          <div className="font-semibold text-sm">{statusUI.title}</div>
          <div className="text-xs opacity-90 mt-0.5">{statusUI.msg}</div>
        </div>
      </div>

      {status === "approved" && order === "none" && (
        <button onClick={onCreateOrder}
          className="mt-4 w-full px-6 py-3 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" /> Create Order
        </button>
      )}

      {(order === "created" || order === "billed") && (
        <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
          <div className="flex items-center gap-2 text-gold font-semibold text-sm">
            <Receipt className="w-4 h-4" /> Your bill is created — please wait 2 to 3 weeks
          </div>
          <div className="text-xs text-foreground/70 mt-2">
            Delivery: {app.order_address}, {app.order_city}, {app.order_state} - {app.order_pincode}
          </div>
        </div>
      )}

      {status === "rejected" && (
        <button onClick={onReapply}
          className="mt-4 w-full px-6 py-3 rounded-full border border-red-400/50 text-red-300 hover:bg-red-500/10 font-semibold uppercase tracking-widest text-sm">
          Remove & Re-apply
        </button>
      )}
    </div>
  );
}

function OrderModal({ app, onClose, onDone }: { app: App; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const patch = {
      order_address: fd.get("address") as string,
      order_city: fd.get("city") as string,
      order_state: fd.get("state") as string,
      order_pincode: fd.get("pincode") as string,
      order_status: "created" as const,
      order_created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("applications").update(patch as never).eq("id", app.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Your bill is created — please wait 2 to 3 weeks!");
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-deep/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="luxury-card w-full max-w-lg p-8 space-y-4">
        <div className="text-center mb-2">
          <MapPin className="w-10 h-10 text-gold mx-auto mb-2" />
          <h2 className="font-display text-2xl">Delivery Details</h2>
          <p className="text-xs text-muted-foreground mt-1">For application: {app.full_name}</p>
        </div>
        <Field label="Full Address" name="address" required />
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" name="city" required />
          <Field label="State" name="state" required />
        </div>
        <Field label="Pincode" name="pincode" required pattern="\d{6}" />
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 px-6 py-3 rounded-full border border-border hover:border-gold/40 text-sm uppercase tracking-widest">
            Cancel
          </button>
          <button type="submit" disabled={busy}
            className="flex-1 px-6 py-3 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, ...rest }: any) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <input {...rest}
        className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
    </div>
  );
}
