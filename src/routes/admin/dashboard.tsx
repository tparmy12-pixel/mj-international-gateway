import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut, Search, Filter, Download, Crown, MessageCircle, Loader2,
  CheckCircle2, XCircle, Clock, RotateCw, Sparkles, Plane, Eye, X,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin Dashboard — MJ International" }] }),
});

type App = any;
const STATUSES = ["pending", "processing", "approved", "rejected", "completed"] as const;
const PAY_STATUSES = ["unpaid", "partial", "paid", "refunded"] as const;
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  processing: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  approved: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  rejected: "bg-red-500/20 text-red-300 border-red-400/40",
  completed: "bg-purple-500/20 text-purple-300 border-purple-400/40",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<App | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/admin/login" }); return; }
      setUserEmail(session.user.email || "");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) {
        toast.error("You don't have admin access. Ask an admin to grant the role.");
        setAuthorized(false); setLoading(false); return;
      }
      setAuthorized(true);
      await loadApps();
      setLoading(false);
    })();
  }, []);

  async function loadApps() {
    const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setApps(data || []);
  }

  async function logout() { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }

  async function update(id: string, patch: Partial<App>) {
    const { error } = await supabase.from("applications").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Updated");
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    if (selected?.id === id) setSelected({ ...selected, ...patch });
  }

  async function downloadDoc(path: string | null, name: string) {
    if (!path) return toast.error("No file");
    const { data, error } = await supabase.storage.from("applications").createSignedUrl(path, 60 * 10);
    if (error || !data) return toast.error("Failed to fetch");
    const a = document.createElement("a"); a.href = data.signedUrl; a.download = name; a.target = "_blank"; a.click();
  }

  const countries = useMemo(() => Array.from(new Set(apps.map((a) => a.country).filter(Boolean))) as string[], [apps]);

  const filtered = useMemo(() => apps.filter((a) => {
    if (country && a.country !== country) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [a.full_name, a.email, a.mobile_number, a.passport_number].some((v: any) => v?.toLowerCase().includes(q));
    }
    return true;
  }), [apps, search, country, statusFilter]);

  const stats = useMemo(() => ({
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    completed: apps.filter((a) => a.status === "completed").length,
  }), [apps]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="luxury-card p-10 text-center max-w-md">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="font-display text-2xl mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Your account ({userEmail}) doesn't have admin privileges. Ask an existing admin to grant access.
        </p>
        <button onClick={logout} className="px-6 py-2.5 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm">Sign Out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-gold/10 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-gold" />
            <span className="font-display text-lg gold-text font-bold">MJ Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
            <button onClick={loadApps} className="p-2 rounded-lg glass hover:bg-gold/10" title="Refresh"><RotateCw className="w-4 h-4 text-gold" /></button>
            <button onClick={logout} className="p-2 rounded-lg glass hover:bg-red-500/10" title="Sign out"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { l: "Total", v: stats.total, i: Sparkles },
            { l: "Pending", v: stats.pending, i: Clock },
            { l: "Approved", v: stats.approved, i: CheckCircle2 },
            { l: "Completed", v: stats.completed, i: Crown },
          ].map((s) => (
            <div key={s.l} className="luxury-card p-6 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                <div className="font-display text-3xl gold-text font-bold mt-1">{s.v}</div>
              </div>
              <s.i className="w-8 h-8 text-gold/60" />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="luxury-card p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, passport…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none text-sm" />
          </div>
          <select value={country} onChange={(e) => setCountry(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none text-sm">
            <option value="">All Countries</option>
            {countries.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none text-sm">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="luxury-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy-deep/50 border-b border-gold/15">
                <tr className="text-left">
                  {["Applicant", "Country", "Service", "Status", "Payment", "VIP", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs uppercase tracking-widest text-gold font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-muted-foreground">No applications found.</td></tr>
                ) : filtered.map((a) => (
                  <tr key={a.id} className="border-b border-gold/5 hover:bg-gold/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold flex items-center gap-2">
                        {a.is_vip && <Crown className="w-3.5 h-3.5 text-gold" />}
                        {a.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">{a.email} · {a.mobile_number}</div>
                    </td>
                    <td className="px-4 py-3">{a.country || "—"}</td>
                    <td className="px-4 py-3 text-xs">{(a.services || []).slice(0, 2).join(", ") || "—"}{a.services?.length > 2 && ` +${a.services.length - 2}`}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border ${STATUS_COLOR[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs uppercase">{a.payment_status}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => update(a.id, { is_vip: !a.is_vip })}
                        className={`p-1.5 rounded-md ${a.is_vip ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-gold"}`}>
                        <Crown className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(a)} className="p-1.5 rounded-md hover:bg-gold/10 text-gold">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 bg-navy-deep/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}>
          <div className="luxury-card w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 glass border-b border-gold/15 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {selected.is_vip && <Crown className="w-5 h-5 text-gold" />}
                <h2 className="font-display text-xl">{selected.full_name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gold/10 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</label>
                  <select value={selected.status} onChange={(e) => update(selected.id, { status: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-input/50 border border-border text-sm">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Payment</label>
                  <select value={selected.payment_status} onChange={(e) => update(selected.id, { payment_status: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-input/50 border border-border text-sm">
                    {PAY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <a href={`https://wa.me/${(selected.whatsapp_number || selected.mobile_number || "").replace(/\D/g, "")}`}
                    target="_blank" rel="noreferrer"
                    className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-white"
                    style={{ background: "#25D366" }}>
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={() => update(selected.id, { status: "approved" })}
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => update(selected.id, { status: "rejected" })}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-400/40 text-sm font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>

              <Detail label="Personal">
                <Row k="Father" v={selected.father_name} />
                <Row k="DOB" v={selected.date_of_birth} />
                <Row k="Gender" v={selected.gender} />
                <Row k="Nationality" v={selected.nationality} />
                <Row k="Email" v={selected.email} />
                <Row k="Mobile" v={selected.mobile_number} />
                <Row k="WhatsApp" v={selected.whatsapp_number} />
                <Row k="Address" v={selected.full_address} full />
              </Detail>

              <Detail label="Passport">
                <Row k="Number" v={selected.passport_number} />
                <Row k="Issued" v={selected.passport_issue_date} />
                <Row k="Expires" v={selected.passport_expiry_date} />
              </Detail>

              <Detail label="Travel">
                <Row k="Country" v={selected.country} />
                <Row k="Purpose" v={selected.travel_purpose} />
                <Row k="Departure" v={selected.departure_date} />
                <Row k="Return" v={selected.return_date} />
                <Row k="Travelers" v={`${selected.adults_count || 0} adult(s), ${selected.children_count || 0} child(ren)`} />
                <Row k="Services" v={(selected.services || []).join(", ")} full />
              </Detail>

              <Detail label="Documents">
                {[
                  ["Passport Front", selected.passport_front_url],
                  ["Passport Back", selected.passport_back_url],
                  ["Photo", selected.photo_url],
                  ["Aadhaar", selected.aadhaar_url],
                  ["Bank Statement", selected.bank_statement_url],
                ].map(([label, path]) => (
                  <div key={label as string} className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    {path ? (
                      <button onClick={() => downloadDoc(path as string, label as string)}
                        className="text-gold text-sm flex items-center gap-1.5 hover:underline">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    ) : <span className="text-xs text-muted-foreground/60">Not provided</span>}
                  </div>
                ))}
              </Detail>

              {selected.notes && (
                <Detail label="Notes">
                  <p className="text-sm text-foreground/80 sm:col-span-2">{selected.notes}</p>
                </Detail>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.3em] text-gold mb-3">{label}</h3>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">{children}</div>
    </div>
  );
}
function Row({ k, v, full }: { k: string; v: any; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <span className="text-muted-foreground">{k}: </span>
      <span className="text-foreground/90">{v || "—"}</span>
    </div>
  );
}
