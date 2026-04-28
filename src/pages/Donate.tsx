import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useSetting } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Heart, Calendar, Mail as MailIcon, Check, ArrowRight,
  Smartphone, Building, Wallet, Gift,
} from "lucide-react";

type TabKey = "one_time" | "monthly" | "card";

const ONE_TIME_AMOUNTS = [1000, 3000, 5000, 10000, 20000];
const MONTHLY_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const CARD_AMOUNTS = [500, 1000, 2500, 5000];

const OCCASIONS = [
  "Birthday", "Anniversary", "Bar/Bat Mitzvah", "Wedding",
  "In Memory", "Get Well", "Thank You", "Just Because",
];

const donateFallback = {
  intro: "Your donation helps preserve our heritage, educate our youth, and support families in need.",
  mpesa: "Paybill: 000000\nAccount: KJC-DONATION",
  paypal: "paypal.me/kisiijewish",
  bank: "Bank: Equity Bank\nAccount: 0000000000\nName: Kisii Jewish Community",
  treasurer_phone: "+254 700 000 000",
  treasurer_email: "treasurer@kisiijewish.org",
};

const tabs: { key: TabKey; label: string; icon: any; hash: string }[] = [
  { key: "one_time", label: "Make a One-Time Gift", icon: Heart, hash: "#one-time" },
  { key: "monthly", label: "Make a Monthly Gift", icon: Calendar, hash: "#monthly" },
  { key: "card", label: "Send a Card", icon: Gift, hash: "#card" },
];

const Donate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: donateData } = useSetting<any>("donate_info", donateFallback);
  const d = { ...donateFallback, ...(donateData ?? {}) };

  const initial: TabKey = location.hash === "#monthly" ? "monthly"
    : location.hash === "#card" ? "card" : "one_time";
  const [tab, setTab] = useState<TabKey>(initial);

  useEffect(() => {
    const map: Record<string, TabKey> = { "#one-time": "one_time", "#monthly": "monthly", "#card": "card" };
    if (location.hash && map[location.hash]) setTab(map[location.hash]);
  }, [location.hash]);

  const switchTab = (k: TabKey) => {
    setTab(k);
    const hash = tabs.find((t) => t.key === k)?.hash ?? "";
    navigate({ pathname: "/donate", hash }, { replace: true });
  };

  return (
    <>
      <PageHero
        title="Donate today"
        subtitle="Your gift to our community makes us stronger together."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4">
              Your gift makes our community stronger.
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{d.intro}</p>
          </div>

          {/* Tab pills */}
          <div className="grid sm:grid-cols-3 gap-3 md:gap-4 mb-10">
            {tabs.map(({ key, label, icon: Icon }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchTab(key)}
                  className={cn(
                    "flex items-center justify-center gap-3 px-4 py-4 rounded-md font-display font-bold uppercase tracking-wider text-sm transition-smooth border-2",
                    active
                      ? "bg-sky text-sky-foreground border-sky shadow-soft"
                      : "bg-sky-soft text-sky border-sky-soft hover:border-sky"
                  )}
                  aria-pressed={active}
                >
                  <span className={cn(
                    "h-5 w-5 rounded-sm border-2 flex items-center justify-center shrink-0",
                    active ? "bg-background border-background" : "bg-background border-sky/40"
                  )}>
                    {active && <Check className="h-3.5 w-3.5 text-sky" strokeWidth={3} />}
                  </span>
                  <Icon className="h-4 w-4 shrink-0 hidden sm:block" />
                  <span className="text-center leading-tight">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Active tab panel */}
          <div className="animate-fade-in">
            {tab === "one_time" && <DonationForm key="one_time" donationType="one_time" amounts={ONE_TIME_AMOUNTS} settings={d} />}
            {tab === "monthly" && <DonationForm key="monthly" donationType="monthly" amounts={MONTHLY_AMOUNTS} settings={d} />}
            {tab === "card" && <SendCardForm amounts={CARD_AMOUNTS} settings={d} />}
          </div>

          {/* Fine print */}
          <Card className="mt-10 p-6 md:p-8 bg-sky-soft border-sky/20">
            <p className="text-sm text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto">
              Tax receipts are issued for donations of KSh 1,000 and above. The receipt will be sent to the email address you provide.
              By donating you may receive periodic updates from the Kisii Jewish Community.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed text-center mt-4">
              Questions about giving? Contact our donor services team at{" "}
              <a href={`tel:${d.treasurer_phone}`} className="text-sky font-semibold">{d.treasurer_phone}</a>.<br />
              For inquiries over email, please write to:{" "}
              <a href={`mailto:${d.treasurer_email}`} className="text-sky font-semibold">{d.treasurer_email}</a>
            </p>
          </Card>
        </div>
      </section>
    </>
  );
};

/* -------------------- Shared donation form (one-time + monthly) -------------------- */

const DonationForm = ({
  donationType, amounts, settings,
}: { donationType: "one_time" | "monthly"; amounts: number[]; settings: any }) => {
  const [amount, setAmount] = useState<number | "other">(amounts[1] ?? amounts[0]);
  const [otherAmount, setOtherAmount] = useState<string>("");
  const [donorType, setDonorType] = useState<"personal" | "company">("personal");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isTribute, setIsTribute] = useState(false);
  const [tributeName, setTributeName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "bank" | "paypal">("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string; method: string } | null>(null);

  const finalAmount = useMemo(() => {
    if (amount === "other") return Number(otherAmount) || 0;
    return Number(amount) || 0;
  }, [amount, otherAmount]);

  const min = donationType === "monthly" ? 100 : 100;
  const valid = finalAmount >= min && firstName && lastName && email;

  const reset = () => {
    setDone(null);
    setAmount(amounts[1] ?? amounts[0]);
    setOtherAmount("");
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setAddress(""); setCity(""); setStateRegion(""); setPostalCode("");
    setAccountNumber(""); setIsTribute(false); setTributeName("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      toast.error(`Please fill in required fields (minimum KSh ${min}).`);
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.from("donations").insert({
      donation_type: donationType,
      frequency: donationType === "monthly" ? "monthly" : "once",
      amount: finalAmount,
      currency: "KES",
      donor_type: donorType,
      donor_name: `${firstName} ${lastName}`.trim(),
      donor_email: email,
      donor_phone: phone || null,
      company_name: donorType === "company" ? companyName || null : null,
      address: address || null,
      city: city || null,
      country,
      state_region: stateRegion || null,
      postal_code: postalCode || null,
      account_number: accountNumber || null,
      payment_method: paymentMethod,
      is_tribute: isTribute,
      tribute_name: isTribute ? tributeName || null : null,
    }).select("id").single();

    setSubmitting(false);
    if (error || !data) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone({ ref: data.id.slice(0, 8).toUpperCase(), method: paymentMethod });
    toast.success("Thank you! Your pledge has been recorded.");
  };

  if (done) {
    return (
      <Card className="p-8 md:p-10 border-border bg-card shadow-card text-center">
        <div className="h-14 w-14 rounded-full bg-sky-soft text-sky mx-auto flex items-center justify-center mb-4">
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>
        <h3 className="font-display text-2xl font-bold text-primary mb-2">Thank you!</h3>
        <p className="text-muted-foreground mb-2">
          Your reference number is <span className="font-mono font-bold text-primary">{done.ref}</span>.
        </p>
        <p className="text-muted-foreground mb-6">Please complete your gift using the instructions below:</p>
        <Card className="p-5 bg-sky-soft border-sky/20 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-primary mb-2">
            {done.method === "mpesa" ? "M-Pesa" : done.method === "bank" ? "Bank transfer" : "PayPal"}
          </h4>
          <p className="text-sm text-foreground/85 whitespace-pre-line">
            {done.method === "mpesa" ? settings.mpesa : done.method === "bank" ? settings.bank : settings.paypal}
          </p>
          <p className="text-xs text-muted-foreground mt-3">Use reference: <span className="font-mono">{done.ref}</span></p>
        </Card>
        <Button onClick={reset} variant="outline" className="mt-6">Make another gift</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 border-border bg-card shadow-card">
      <form onSubmit={submit} className="space-y-8">
        {/* Step 1 */}
        <Step number={1} title={donationType === "monthly" ? "Monthly payment amount" : "Amount information"}>
          <p className="text-sm text-muted-foreground mb-4">
            Please specify the amount you'd like to donate{donationType === "monthly" ? " each month" : ""}:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {amounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                className={cn(
                  "py-3 rounded-md font-semibold border-2 transition-smooth",
                  amount === a
                    ? "bg-sky text-sky-foreground border-sky"
                    : "bg-background text-foreground border-border hover:border-sky"
                )}
              >
                {a.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount("other" as any)}
              className={cn(
                "py-3 rounded-md font-semibold border-2 transition-smooth",
                amount === ("other" as any)
                  ? "bg-sky text-sky-foreground border-sky"
                  : "bg-background text-foreground border-border hover:border-sky"
              )}
            >
              Other
            </button>
          </div>
          {amount === ("other" as any) && (
            <div className="mt-3 max-w-xs">
              <Input
                type="number"
                min={min}
                placeholder={`Min KSh ${min}`}
                value={otherAmount}
                onChange={(e) => setOtherAmount(e.target.value)}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">All amounts in Kenyan Shillings (KES). Minimum KSh {min}.</p>
        </Step>

        {/* Step 2 */}
        <Step number={2} title="Donor information">
          <p className="text-sm text-muted-foreground mb-4">
            We'll use this to issue your tax receipt.
          </p>
          <div className="mb-4">
            <Label className="text-sm">Is it a personal or company donation? *</Label>
            <RadioGroup value={donorType} onValueChange={(v) => setDonorType(v as any)} className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="personal" /> <span className="text-sm">Personal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="company" /> <span className="text-sm">Company</span>
              </label>
            </RadioGroup>
          </div>

          {donorType === "company" && (
            <Field label="Company name *">
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </Field>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First name *"><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></Field>
            <Field label="Last name *"><Input value={lastName} onChange={(e) => setLastName(e.target.value)} required /></Field>
            <Field label="Email *"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
            <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
            <Field label="Address" className="sm:col-span-2"><Input value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
            <Field label="City"><Input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
            <Field label="Country">
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Kenya", "Uganda", "Tanzania", "United States", "United Kingdom", "Canada", "Israel", "Other"].map(c =>
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </Field>
            <Field label="County / State"><Input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} /></Field>
            <Field label="Postal code"><Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} /></Field>
            <Field label="Account number (optional)" className="sm:col-span-2"><Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} /></Field>
          </div>

          <div className="mt-4">
            <Label className="text-sm">Is this gift in honour or memory of someone? *</Label>
            <RadioGroup value={isTribute ? "yes" : "no"} onValueChange={(v) => setIsTribute(v === "yes")} className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="no" /> <span className="text-sm">No</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="yes" /> <span className="text-sm">Yes</span>
              </label>
            </RadioGroup>
            {isTribute && (
              <div className="mt-3 max-w-md">
                <Field label="In honour / memory of">
                  <Input value={tributeName} onChange={(e) => setTributeName(e.target.value)} />
                </Field>
              </div>
            )}
          </div>
        </Step>

        {/* Step 3 */}
        <Step number={3} title="Payment method">
          {donationType === "monthly" && (
            <div className="mb-5 p-4 rounded-md bg-accent-soft border border-accent/20 text-sm text-foreground/80">
              <strong className="text-primary">Important!</strong> To make any changes to your existing monthly donation, please contact us at{" "}
              <a href={`tel:${settings.treasurer_phone}`} className="text-sky font-semibold">{settings.treasurer_phone}</a> or{" "}
              <a href={`mailto:${settings.treasurer_email}`} className="text-sky font-semibold">{settings.treasurer_email}</a>.
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-4">Select how you'd like to give. We'll show you the instructions to complete your gift.</p>
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid sm:grid-cols-3 gap-3">
            {[
              { v: "mpesa", label: "M-Pesa", Icon: Smartphone },
              { v: "bank", label: "Bank transfer", Icon: Building },
              { v: "paypal", label: "PayPal", Icon: Wallet },
            ].map(({ v, label, Icon }) => (
              <label
                key={v}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer transition-smooth",
                  paymentMethod === v ? "border-sky bg-sky-soft" : "border-border hover:border-sky"
                )}
              >
                <RadioGroupItem value={v} />
                <Icon className="h-5 w-5 text-sky" />
                <span className="font-semibold text-primary">{label}</span>
              </label>
            ))}
          </RadioGroup>
        </Step>

        <Button
          type="submit"
          disabled={submitting || !valid}
          className="w-full bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-bold py-6"
        >
          {submitting ? "Submitting…" : <>Next: Verification <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>
      </form>
    </Card>
  );
};

/* -------------------- Send a card form -------------------- */

const SendCardForm = ({ amounts, settings }: { amounts: number[]; settings: any }) => {
  const [amount, setAmount] = useState<number | "other">(amounts[1]);
  const [otherAmount, setOtherAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "bank" | "paypal">("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string; method: string } | null>(null);

  const finalAmount = useMemo(() => amount === "other" ? Number(otherAmount) || 0 : Number(amount) || 0, [amount, otherAmount]);
  const valid = finalAmount >= 100 && senderName && senderEmail && recipientName && recipientEmail && message;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) { toast.error("Please complete all required fields."); return; }
    setSubmitting(true);
    const { data, error } = await supabase.from("donations").insert({
      donation_type: "tribute_card",
      frequency: "once",
      amount: finalAmount,
      currency: "KES",
      donor_type: "personal",
      donor_name: senderName,
      donor_email: senderEmail,
      payment_method: paymentMethod,
      is_tribute: true,
      tribute_name: recipientName,
      tribute_recipient_email: recipientEmail,
      tribute_message: `[${occasion}] ${message}`,
    }).select("id").single();
    setSubmitting(false);
    if (error || !data) { toast.error("Could not submit. Please try again."); return; }
    setDone({ ref: data.id.slice(0, 8).toUpperCase(), method: paymentMethod });
    toast.success("Card pledge submitted!");
  };

  if (done) {
    return (
      <Card className="p-8 md:p-10 border-border bg-card shadow-card text-center">
        <div className="h-14 w-14 rounded-full bg-sky-soft text-sky mx-auto flex items-center justify-center mb-4">
          <MailIcon className="h-7 w-7" />
        </div>
        <h3 className="font-display text-2xl font-bold text-primary mb-2">Card on its way!</h3>
        <p className="text-muted-foreground mb-2">
          Reference: <span className="font-mono font-bold text-primary">{done.ref}</span>
        </p>
        <p className="text-muted-foreground mb-6">Once we receive your gift, we'll send the card to your recipient.</p>
        <Card className="p-5 bg-sky-soft border-sky/20 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-primary mb-2">
            {done.method === "mpesa" ? "M-Pesa" : done.method === "bank" ? "Bank transfer" : "PayPal"}
          </h4>
          <p className="text-sm text-foreground/85 whitespace-pre-line">
            {done.method === "mpesa" ? settings.mpesa : done.method === "bank" ? settings.bank : settings.paypal}
          </p>
          <p className="text-xs text-muted-foreground mt-3">Use reference: <span className="font-mono">{done.ref}</span></p>
        </Card>
        <Button onClick={() => setDone(null)} variant="outline" className="mt-6">Send another</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 border-border bg-card shadow-card">
      <form onSubmit={submit} className="space-y-8">
        <Step number={1} title="Choose an amount">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {amounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                className={cn(
                  "py-3 rounded-md font-semibold border-2 transition-smooth",
                  amount === a ? "bg-sky text-sky-foreground border-sky" : "bg-background text-foreground border-border hover:border-sky"
                )}
              >
                {a.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount("other" as any)}
              className={cn(
                "py-3 rounded-md font-semibold border-2 transition-smooth",
                amount === ("other" as any) ? "bg-sky text-sky-foreground border-sky" : "bg-background text-foreground border-border hover:border-sky"
              )}
            >
              Other
            </button>
          </div>
          {amount === ("other" as any) && (
            <div className="mt-3 max-w-xs">
              <Input type="number" min={100} placeholder="Min KSh 100" value={otherAmount} onChange={(e) => setOtherAmount(e.target.value)} />
            </div>
          )}
        </Step>

        <Step number={2} title="Card details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name *"><Input value={senderName} onChange={(e) => setSenderName(e.target.value)} required /></Field>
            <Field label="Your email *"><Input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required /></Field>
            <Field label="Recipient name *"><Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required /></Field>
            <Field label="Recipient email *"><Input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required /></Field>
            <Field label="Occasion *" className="sm:col-span-2">
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Personal message *" className="sm:col-span-2">
              <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={2000} />
            </Field>
          </div>
        </Step>

        <Step number={3} title="Payment method">
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid sm:grid-cols-3 gap-3">
            {[
              { v: "mpesa", label: "M-Pesa", Icon: Smartphone },
              { v: "bank", label: "Bank transfer", Icon: Building },
              { v: "paypal", label: "PayPal", Icon: Wallet },
            ].map(({ v, label, Icon }) => (
              <label key={v} className={cn(
                "flex items-center gap-3 p-4 rounded-md border-2 cursor-pointer transition-smooth",
                paymentMethod === v ? "border-sky bg-sky-soft" : "border-border hover:border-sky"
              )}>
                <RadioGroupItem value={v} />
                <Icon className="h-5 w-5 text-sky" />
                <span className="font-semibold text-primary">{label}</span>
              </label>
            ))}
          </RadioGroup>
        </Step>

        <Button
          type="submit"
          disabled={submitting || !valid}
          className="w-full bg-sky text-sky-foreground hover:bg-sky/90 uppercase tracking-wider font-bold py-6"
        >
          {submitting ? "Submitting…" : <>Send Card <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>
      </form>
    </Card>
  );
};

/* -------------------- helpers -------------------- */

const Step = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="h-8 w-8 rounded-full bg-sky text-sky-foreground flex items-center justify-center font-bold text-sm shrink-0">
        {number}
      </div>
      <h3 className="font-display text-xl font-bold text-primary">Step {number}: {title}</h3>
    </div>
    <div className="pl-0 sm:pl-11">{children}</div>
  </div>
);

const Field = ({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <Label className="text-sm">{label}</Label>
    <div className="mt-1.5">{children}</div>
  </div>
);

export default Donate;
