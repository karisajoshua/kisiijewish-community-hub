import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

const redirectAfterAuth = async (navigate: (p: string) => void, userId: string, redirect: string | null) => {
  if (redirect && redirect.startsWith("/")) {
    navigate(redirect);
    return;
  }
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isAdmin = (roles ?? []).some((r: any) => r.role === "admin");
  navigate(isAdmin ? "/admin" : "/account");
};

const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) redirectAfterAuth(navigate, data.session.user.id, redirect);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setTimeout(() => redirectAfterAuth(navigate, session.user.id, redirect), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, redirect]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back!");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin + "/account" },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Account created! Check your email to verify.");
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/account" });
    if (result.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-soft px-4 py-12">
      <Card className="w-full max-w-md p-8 border-border bg-card shadow-soft">
        <Link to="/" className="flex items-center justify-center mb-6">
          <Logo variant="navbar" className="h-16 w-auto" />
        </Link>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 mt-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              <Button type="submit" disabled={loading} className="w-full bg-sky text-sky-foreground hover:bg-sky/90">Sign in</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 mt-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
              <Button type="submit" disabled={loading} className="w-full bg-sky text-sky-foreground hover:bg-sky/90">Create account</Button>
              <p className="text-xs text-muted-foreground text-center">The first account becomes the admin.</p>
            </form>
          </TabsContent>
        </Tabs>
        <div className="mt-5">
          <div className="relative my-3"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground uppercase">or</span></div></div>
          <Button variant="outline" onClick={handleGoogle} className="w-full">Continue with Google</Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-5"><Link to="/" className="hover:text-sky">← Back to site</Link></p>
      </Card>
    </div>
  );
};

export default Auth;
