import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContacts } from "@/components/FloatingContacts";
import { SERVICES, COUNTRIES } from "@/lib/services-data";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/apply")({
  component: ApplyPage,
  head: () => ({
    meta: [
      { title: "Apply Online — MJ International Tours" },
      { name: "description", content: "Submit your travel application for visa, Umrah, Haj, tours, hotels and flights." },
    ],
  }),
});

type FileField = "passport_front" | "passport_back" | "photo" | "aadhaar" | "bank_statement";

function ApplyPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [files, setFiles] = useState<Partial<Record<FileField, File>>>({});

  const toggleService = (k: string) =>
    setServices((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const onFile = (k: FileField, f: File | undefined) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error("File must be under 10 MB"); return; }
    setFiles((p) => ({ ...p, [k]: f }));
  };

  async function uploadFile(file: File, prefix: string): Promise<string | null> {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${Date.now()}-${prefix}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("applications").upload(path, file, { upsert: false });
    if (error) { console.error(error); return null; }
    return path;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const get = (k: string) => (form.get(k) as string) || null;
    const getNum = (k: string) => { const v = form.get(k); return v ? Number(v) : null; };

    try {
      const [passport_front_url, passport_back_url, photo_url, aadhaar_url, bank_statement_url] = await Promise.all([
        files.passport_front ? uploadFile(files.passport_front, "pf") : Promise.resolve(null),
        files.passport_back ? uploadFile(files.passport_back, "pb") : Promise.resolve(null),
        files.photo ? uploadFile(files.photo, "ph") : Promise.resolve(null),
        files.aadhaar ? uploadFile(files.aadhaar, "ad") : Promise.resolve(null),
        files.bank_statement ? uploadFile(files.bank_statement, "bs") : Promise.resolve(null),
      ]);

      const { error } = await supabase.from("applications").insert({
        full_name: get("full_name")!,
        father_name: get("father_name"),
        date_of_birth: get("date_of_birth"),
        gender: get("gender"),
        nationality: get("nationality"),
        mobile_number: get("mobile_number")!,
        whatsapp_number: get("whatsapp_number"),
        email: get("email")!,
        full_address: get("full_address"),
        passport_number: get("passport_number"),
        passport_issue_date: get("passport_issue_date"),
        passport_expiry_date: get("passport_expiry_date"),
        passport_front_url, passport_back_url,
        country: get("country"),
        travel_purpose: get("travel_purpose"),
        departure_date: get("departure_date"),
        return_date: get("return_date"),
        num_travelers: getNum("num_travelers") ?? 1,
        adults_count: getNum("adults_count") ?? 1,
        children_count: getNum("children_count") ?? 0,
        services,
        photo_url, aadhaar_url, bank_statement_url,
        notes: get("notes"),
      });
      if (error) throw error;
      setDone(true);
      toast.success("Application submitted! Our team will contact you within 24 hours.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen">
        <Navbar /><FloatingContacts />
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-2xl mx-auto luxury-card p-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-gold mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl font-bold">Application <span className="gold-text">Received</span></h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Thank you for choosing MJ International Tours. Our travel concierge will reach out within 24 hours via your provided contact details.
            </p>
            <button onClick={() => navigate({ to: "/" })}
              className="mt-8 px-8 py-3 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm">
              Back Home
            </button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar /><FloatingContacts />
      <section className="pt-40 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Travel Application</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold">
              Begin Your <span className="gold-text">Journey</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Fill in your details below. All information is securely stored.
            </p>
          </div>

          <form onSubmit={onSubmit} className="luxury-card p-6 md:p-12 space-y-12">
            <Section title="Personal Information">
              <Field label="Full Name" name="full_name" required />
              <Field label="Father's Name" name="father_name" />
              <Field label="Date of Birth" name="date_of_birth" type="date" />
              <Select label="Gender" name="gender" options={["Male", "Female", "Other"]} />
              <Field label="Nationality" name="nationality" placeholder="e.g. Indian" />
              <Field label="Mobile Number" name="mobile_number" type="tel" required />
              <Field label="WhatsApp Number" name="whatsapp_number" type="tel" />
              <Field label="Email" name="email" type="email" required />
              <Field label="Full Address" name="full_address" full />
            </Section>

            <Section title="Passport Details">
              <Field label="Passport Number" name="passport_number" />
              <Field label="Issue Date" name="passport_issue_date" type="date" />
              <Field label="Expiry Date" name="passport_expiry_date" type="date" />
              <FileInput label="Passport Front" onChange={(f) => onFile("passport_front", f)} value={files.passport_front} />
              <FileInput label="Passport Back" onChange={(f) => onFile("passport_back", f)} value={files.passport_back} />
            </Section>

            <Section title="Travel Plan">
              <Select label="Destination Country" name="country" options={COUNTRIES} />
              <Field label="Travel Purpose" name="travel_purpose" placeholder="e.g. Umrah, Tour, Visit" />
              <Field label="Departure Date" name="departure_date" type="date" />
              <Field label="Return Date" name="return_date" type="date" />
              <Field label="Total Travelers" name="num_travelers" type="number" defaultValue="1" min="1" />
              <Field label="Adults" name="adults_count" type="number" defaultValue="1" min="0" />
              <Field label="Children" name="children_count" type="number" defaultValue="0" min="0" />
            </Section>

            <Section title="Services Required">
              <div className="md:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SERVICES.map((s) => (
                  <label key={s.key} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${services.includes(s.key) ? "border-gold bg-gold/10" : "border-border hover:border-gold/40"}`}>
                    <input type="checkbox" className="sr-only" checked={services.includes(s.key)} onChange={() => toggleService(s.key)} />
                    <s.icon className={`w-5 h-5 ${services.includes(s.key) ? "text-gold" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{s.title}</span>
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Document Uploads">
              <FileInput label="Passport-Size Photo" onChange={(f) => onFile("photo", f)} value={files.photo} />
              <FileInput label="Aadhaar Card" onChange={(f) => onFile("aadhaar", f)} value={files.aadhaar} />
              <FileInput label="Bank Statement" onChange={(f) => onFile("bank_statement", f)} value={files.bank_statement} />
            </Section>

            <Section title="Additional Notes">
              <div className="md:col-span-2">
                <textarea name="notes" rows={4} placeholder="Any special requirements, dietary preferences, accessibility, etc."
                  className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
              </div>
            </Section>

            <div className="pt-6 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">By submitting you agree to be contacted by our travel team.</p>
              <button type="submit" disabled={submitting}
                className="px-10 py-4 rounded-full btn-gold font-semibold uppercase tracking-widest text-sm flex items-center gap-3 disabled:opacity-60">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-2xl mb-6 flex items-center gap-3">
        <span className="w-8 h-px bg-gold" />
        <span className="gold-text">{title}</span>
      </h3>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder, defaultValue, min, full }: any) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} min={min}
        className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: readonly string[] }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <select name={name} defaultValue=""
        className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FileInput({ label, onChange, value }: { label: string; onChange: (f?: File) => void; value?: File }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${value ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
        <Upload className={`w-5 h-5 ${value ? "text-gold" : "text-muted-foreground"}`} />
        <span className="text-sm truncate flex-1">{value ? value.name : "Click to upload (max 10MB)"}</span>
        <input type="file" className="sr-only" accept="image/*,application/pdf"
          onChange={(e) => onChange(e.target.files?.[0])} />
      </label>
    </div>
  );
}
