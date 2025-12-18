import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/hooks/use-toast";
import { 
  LogIn, 
  Mail, 
  Lock,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        setLocation("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWithSidePanels>
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1 px-4 mb-4">
            <LogIn className="w-4 h-4 mr-2" />
            Welcome Back
          </Badge>
          <h1 className="text-3xl font-bold">Sign in to i2u.ai</h1>
          <p className="text-muted-foreground mt-2">Access your dashboard and manage your startup profile</p>
          <div className="mt-4">
            <DynamicPricingBanner showBenefits={false} compact={true} />
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-login-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-login-password"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" data-testid="checkbox-remember" />
                <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading} data-testid="button-login-submit">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Don't have an account?
              </p>
              <Link href="/register">
                <Button variant="outline" className="w-full" data-testid="button-goto-register">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create an Account
                </Button>
              </Link>
            </div>
            
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="/about" className="text-primary hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/about" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </motion.div>

      <div className="mt-12 w-full max-w-6xl mx-auto">
        <BlogInsightsSection />
      </div>

      <div className="mt-8 w-full max-w-7xl mx-auto">
        <RotatingInsightsQuotes variant="default" />
      </div>
    </div>
    </PageWithSidePanels>
  );
}
