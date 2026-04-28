import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useSetting } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Heart, Calendar, Check, ArrowRight,
  Smartphone, Building, Wallet,
} from "lucide-react";

type TabKey = "one_time" | "monthly";

type CurrencyInfo = { code: string; symbol: string; presets: number[] };

const COUNTRY_CURRENCY: Record<string, CurrencyInfo> = {
  Kenya:           { code: "KES", symbol: "KSh", presets: [1000, 3000, 5000, 10000, 20000] },
  Uganda:          { code: "UGX", symbol: "USh", presets: [10000, 30000, 50000, 100000, 200000] },
  Tanzania:        { code: "TZS", symbol: "TSh", presets: [5000, 10000, 25000, 50000, 100000] },
  "United States": { code: "USD", symbol: "$",   presets: [25, 50, 100, 250, 500] },
  "United Kingdom":{ code: "GBP", symbol: "£",   presets: [20, 50, 100, 200, 500] },
  Canada:          { code: "CAD", symbol: "$",   presets: [25, 50, 100, 250, 500] },
  Israel:          { code: "ILS", symbol: "₪",   presets: [50, 100, 250, 500, 1000] },
  Other:           { code: "USD", symbol: "$",   presets: [25, 50, 100, 250, 500] },
};

const MONTHLY_DIVISOR = 2;

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
  { key: "monthly",  label: "Make a Monthly Gift",  icon: Calendar, hash: "#monthly" },
];

const Donate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: donateData } = useSetting<any>("donate_info", donateFallback);
  const d = { ...donateFallback, ...(donateData ?? {}) };

  const initial: TabKey = location.hash === "#monthly" ? "monthly" : "one_time";
  const [tab, setTab] = useState<TabKey>(initial);

  useEffect(() => {
    const map: Record<string, TabKey> = { "#one-time": "one_time", "#monthly": "monthly" };
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
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-10">
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

          <div className="animate-fade-in">
            <DonationForm key={tab} donationType={tab} settings={d} />
          </div>

          <Card className="mt-10 p-6 md:p-8 bg-sky-soft border-sky/20">
            <p className="text-sm text-foreground/80 leading-relaxed text-center max-w-3xl mx-auto">
              Tax receipts are issued for qualifying donations. The receipt will be sent to the email address you provide.
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

/* -------------------- Donation form (one-time + monthly) -------------------- */

const DonationForm = ({
  donationType, settings,
}: { donationType: "one_time" | "monthly"; settings: any }) => {
  const [country, setCountry] = useState<string>("Kenya");
  const currency = COUNTRY_CURRENCY[country] ?? COUNTRY_CURRENCY.Other;
  const presets = useMemo(() => {
    return donationType === "monthly"
      ? currency.presets.map((p) => Math.max(1, Math.round(p / MONTHLY_DIVISOR)))
      : currency.presets;
  }, [currency, donationType]);

  const [amount, setAmount] = useState<number | "other">(presets[1] ?? presets[0]);
  const [otherAmount, setOtherAmount] = useState<string>("");
  const [donorType, setDonorType] = useState<"personal" | "company">("personal");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isTribute, setIsTribute] = useState(false);
  const [tributeName, setTributeName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "bank" | "paypal">("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string; method: string; amount: number; currency: CurrencyInfo } | null>(null);

  // Reset selected amount when presets change (e.g. country switch)
  useEffect(() => {
    setAmount(presets[1] ?? presets[0]);
    setOtherAmount("");
  }, [presets]);

  const finalAmount = useMemo(() => {
    if (amount === "other") return Number(otherAmount) || 0;
    return Number(amount) || 0;
  }, [amount, otherAmount]);

  const min = presets[0];
  const valid = finalAmount >= min && firstName && lastName && email;

  const reset = () => {
    setDone(null);
    setAmount(presets[1] ?? presets[0]);
    setOtherAmount("");
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setAddress(""); setCity(""); setStateRegion(""); setPostalCode("");
    setAccountNumber(""); setIsTribute(false); setTributeName("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      toast.error(`Please fill in required fields (minimum ${currency.symbol} ${min.toLocaleString()}).`);
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.from("donations").insert({
      donation_type: donationType,
      frequency: donationType === "monthly" ? "monthly" : "once",
      amount: finalAmount,
      currency: currency.code,
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
    setDone({
      ref: data.id.slice(0, 8).toUpperCase(),
      method: paymentMethod,
      amount: finalAmount,
      currency,
    });
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
        <p className="text-muted-foreground mb-6">
          Please complete your gift of{" "}
          <span className="font-bold text-primary">
            {done.currency.symbol} {done.amount.toLocaleString()} {done.currency.code}
          </span>{" "}
          using the instructions below:
        </p>
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
        {/* Step 1: Country + Amount */}
        <Step number={1} title={donationType === "monthly" ? "Monthly gift amount" : "Gift amount"}>
          <Field label="Your country (sets your currency) *" className="max-w-md mb-5">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(COUNTRY_CURRENCY).map(c =>
                  <SelectItem key={c} value={c}>{c} ({COUNTRY_CURRENCY[c].code})</SelectItem>
                )}
              </SelectContent>
            </Select>
          </Field>

          <p className="text-sm text-muted-foreground mb-4">
            Please specify the amount you'd like to donate{donationType === "monthly" ? " each month" : ""} in{" "}
            <span className="font-semibold text-primary">{currency.code}</span>:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {presets.map((a) => (
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
                {currency.symbol} {a.toLocaleString()}
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
                placeholder={`Min ${currency.symbol} ${min.toLocaleString()}`}
                value={otherAmount}
                onChange={(e) => setOtherAmount(e.target.value)}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            All amounts in {currency.code}. Minimum {currency.symbol} {min.toLocaleString()}.
          </p>
        </Step>

        {/* Step 2: Donor info */}
        <Step number={2} title="Donor information">
          <p className="text-sm text-muted-foreground mb-4">We'll use this to issue your tax receipt.</p>
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
            <Field label="County / State"><Input value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} /></Field>
            <Field label="Postal code"><Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} /></Field>
            <Field label="Account number (optional)"><Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} /></Field>
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

        {/* Step 3: Payment */}
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
          {submitting ? "Submitting…" : <>Pledge {currency.symbol} {finalAmount.toLocaleString()} <ArrowRight className="ml-2 h-4 w-4" /></>}
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
