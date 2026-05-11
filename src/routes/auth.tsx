import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plane, UserPlus, LogIn } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — MJ International Tours" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/track" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim().toLowerCase();
    const password = fd.get("password") as string;
    const phone = (fd.get("phone") as string)?.trim();
    const full_name = (fd.get("full_name") as string)?.trim();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin + "/track",
            data: { phone, full_name },
          },
        });
        if (error) throw error;
        toast.success("Account created! Signing you in…");
        await supabase.auth.signInWithPassword({ email, password });
        navigate({ to: "/track" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/track" });
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="w-full max-w-md luxury-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full btn-gold flex items-center justify-center mb-4">
              {mode === "login" ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plane className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">Customer Portal</span>
            </div>
            <h1 className="font-display text-3xl">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
            <p className="text-sm text-muted-foreground mt-2">Track your applications & manage orders</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <Input label="Full Name" name="full_name" required />
                <Input label="Mobile Number" name="phone" type="tel" required placeholder="+91…" />
              </>
            )}
            <Input label="Email" name="email" type="email" required autoComplete="email" />
            <Input label="Password" name="password" type="password" required minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"} />
            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>
          <div className="text-center mt-6 text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-gold underline">
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-gold">← Back to home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Input({ label, ...rest }: any) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <input {...rest}
        className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
    </div>
  );
}
