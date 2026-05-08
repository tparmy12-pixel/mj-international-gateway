import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Loader2, Plane } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
  head: () => ({ meta: [{ title: "Admin Login — MJ International" }] }),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin/dashboard" },
        });
        if (error) throw error;
        toast.success("Account created. You can now log in. Ask an existing admin to grant you admin role.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md luxury-card p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full btn-gold flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Plane className="w-4 h-4 text-gold" />
            <span className="text-xs uppercase tracking-[0.4em] text-gold">Admin Portal</span>
          </div>
          <h1 className="font-display text-3xl">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
            <input type="email" name="email" required autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <input type="password" name="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full px-6 py-3 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-gold underline">
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground/70 mt-6 leading-relaxed">
          Note: First admin must be granted role manually via the database. Once signed up, contact your developer to grant admin access.
        </p>
      </div>
    </div>
  );
}
