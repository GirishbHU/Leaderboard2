import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { COUNTRIES, SECTORS, OTHERS_SECTOR_VALUE, OTHERS_SUGGEST_VALUE } from "@/lib/mockData";
import { useLocation } from "wouter";
import { Check, Loader2, CreditCard, Shield, Star, Globe, Trophy, Rocket, TrendingUp, Users, Briefcase, Building2, Lightbulb, Heart, Package } from "lucide-react";
import { CashfreeButton } from "@/components/CashfreeButton";
import PayPalButton from "@/components/PayPalButton";
import { GlobalCounters } from "@/components/global-counters";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";

// Schemas
const step1Schema = z.object({
  role: z.enum(["builder", "investor", "enabler", "startup", "professional", "vc", "ngo", "government", "influencer", "accelerator", "mentor", "service_provider", "angel", "supplier"], {
    required_error: "Please select a role",
  }),
});

const step2Schema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  country: z.string().optional(),
  sector: z.string().optional(),
  customSector: z.string().optional(),
  displayPreference: z.enum(["real_name", "username", "anonymous", "fancy_username"]).default("real_name"),
  currency: z.enum(["INR", "USD"]).default("INR"),
}).refine((data) => {
  // At least email OR phone must be provided
  const hasEmail = data.email && data.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const hasPhone = data.phone && data.phone.trim().length >= 10;
  return hasEmail || hasPhone;
}, {
  message: "Please provide either a valid email address or phone number with country code",
  path: ["email"],
}).refine((data) => {
  // If "Others" is selected, customSector must be provided
  if ((data.sector === OTHERS_SECTOR_VALUE || data.sector === OTHERS_SUGGEST_VALUE) && (!data.customSector || data.customSector.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Please enter your custom sector name",
  path: ["customSector"],
});

// Pricing configuration by role
const PRICING = {
  // Professionals get lower pricing (₹99/year)
  professional: { INR: 99, USD: 1.49, futureINR: 999, futureUSD: 14.99 },
  enabler: { INR: 99, USD: 1.49, futureINR: 999, futureUSD: 14.99 },
  // Mentors and Service Providers: ₹999/year (same as default)
  mentor: { INR: 999, USD: 14.99, futureINR: 1999, futureUSD: 29.99 },
  service_provider: { INR: 999, USD: 14.99, futureINR: 1999, futureUSD: 29.99 },
  // Default pricing for startups, investors, etc.
  default: { INR: 999, USD: 14.99, futureINR: 1999, futureUSD: 29.99 },
};

function getPricing(role: string) {
  return PRICING[role as keyof typeof PRICING] || PRICING.default;
}

// All 7 stakeholder types with icons
const STAKEHOLDER_TYPES = [
  { 
    value: "startup", 
    title: "Startup", 
    description: "Building innovative products & companies",
    icon: Rocket,
    isProfessional: false,
    isFree: false
  },
  { 
    value: "investor", 
    title: "Investor / VC", 
    description: "Funding the next unicorns",
    icon: TrendingUp,
    isProfessional: false,
    isFree: false
  },
  { 
    value: "mentor", 
    title: "Mentor / Advisor", 
    description: "Guiding founders to success",
    icon: Lightbulb,
    isProfessional: false,
    isFree: false
  },
  { 
    value: "accelerator", 
    title: "Accelerator / Incubator", 
    description: "Nurturing early-stage startups",
    icon: Building2,
    isProfessional: false,
    isFree: false
  },
  { 
    value: "service_provider", 
    title: "Service Provider", 
    description: "Legal, finance, tech services",
    icon: Briefcase,
    isProfessional: false,
    isFree: false
  },
  { 
    value: "supplier", 
    title: "Suppliers & Vendors", 
    description: "Products, tools, resources for startups",
    icon: Package,
    isProfessional: false,
    isFree: false
  },
  { 
    value: "government", 
    title: "Government / NGO", 
    description: "Supporting ecosystem development",
    icon: Heart,
    isProfessional: false,
    isFree: true
  },
  { 
    value: "professional", 
    title: "Professional", 
    description: "Industry experts & consultants",
    icon: Users,
    isProfessional: true,
    isFree: false
  },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Get pricing based on selected role
  const pricing = getPricing(formData.role || "default");

  const form1 = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: { role: "startup" }
  });

  const form2 = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      country: "",
      sector: "",
      displayPreference: "real_name",
      currency: "INR"
    }
  });

  const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  // Check if role is free (Government/NGO)
  const isFreeRole = (role: string) => {
    const freeRoles = ['government', 'ngo'];
    return freeRoles.includes(role);
  };

  // Handle free registration (no payment required)
  const handleFreeRegistration = async (profileData: z.infer<typeof step2Schema>) => {
    setIsSubmitting(true);
    
    const finalData = { 
      ...formData, 
      ...profileData,
      paymentId: `free_${Date.now()}`,
      paymentStatus: "FREE",
      paymentProvider: "none",
      registrationTimestamp: new Date().toISOString()
    };
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to the platform. Your free access has been activated.",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const onStep2Submit = async (data: z.infer<typeof step2Schema>) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    
    // If free role, register directly without payment
    if (isFreeRole(formData.role)) {
      handleFreeRegistration(data);
      return;
    }
    
    // For paid roles, create user FIRST with pending_payment status
    // Then proceed to payment step
    setIsSubmitting(true);
    
    const registrationData = { 
      ...updatedFormData,
      paymentId: `pending_${Date.now()}`,
      paymentStatus: "PENDING",
      paymentProvider: updatedFormData.currency === "INR" ? "cashfree" : "paypal",
      registrationTimestamp: new Date().toISOString()
    };
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }
      
      // Store user ID for payment update
      setFormData({ ...updatedFormData, userId: result.userId, registered: true });
      
      toast({
        title: "Account Created!",
        description: "Your account is ready. Complete payment to activate all features.",
      });
      
      setIsSubmitting(false);
      setStep(3); // Proceed to payment step
      
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsSubmitting(true);
    
    // Handle both Cashfree and PayPal response shapes
    let paymentId = paymentData.orderId || paymentData.id;
    
    // Check PayPal nested capture ID if top-level id not found
    if (!paymentId && paymentData.purchase_units?.[0]?.payments?.captures?.[0]?.id) {
      paymentId = paymentData.purchase_units[0].payments.captures[0].id;
    }
    
    // Final fallback with timestamp for uniqueness
    if (!paymentId) {
      paymentId = `payment_${Date.now()}`;
    }
    
    console.log("Payment success data:", paymentData);
    console.log("User already registered, updating payment status for userId:", formData.userId);
    
    try {
      // Update existing user's payment status
      const response = await fetch("/api/user/update-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId,
          paymentId,
          paymentProvider: formData.currency === "INR" ? "cashfree" : "paypal"
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Payment update failed");
      }
      
      toast({
        title: "Payment Successful!",
        description: "Your account is now fully activated. Welcome to i2u.ai!",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Payment Update Failed",
        description: error.message || "Payment received but update failed. Please contact support.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  const handleSkipPayment = () => {
    toast({
      title: "Payment Skipped",
      description: "You can complete payment anytime from your dashboard.",
    });
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1500);
  };

  const handlePaymentFailure = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error || "Something went wrong. Please try again.",
      variant: "destructive"
    });
  };

  return (
    <PageWithSidePanels>
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Join the Revolution</h1>
        <DynamicPricingBanner showBenefits={false} compact={true} />
        <GlobalCounters variant="stacked" className="justify-center mb-4" showButton={false} />
        <div className="flex justify-center items-center gap-4">
          <StepIndicator current={step} number={1} label="Role" />
          <div className="w-12 h-0.5 bg-muted" />
          <StepIndicator current={step} number={2} label="Profile" />
          <div className="w-12 h-0.5 bg-muted" />
          <StepIndicator current={step} number={3} label="Payment" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Role</CardTitle>
                <CardDescription>How do you participate in the startup ecosystem?</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form1}>
                  <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-6">
                    <FormField
                      control={form1.control}
                      name="role"
                      render={({ field }) => {
                        const selectedType = STAKEHOLDER_TYPES.find(t => t.value === field.value);
                        const SelectedIcon = selectedType?.icon;
                        
                        return (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                              >
                                {STAKEHOLDER_TYPES.map((type, index) => (
                                  <RoleCard 
                                    key={type.value}
                                    value={type.value} 
                                    title={type.title} 
                                    description={type.description}
                                    icon={type.icon}
                                    isProfessional={type.isProfessional}
                                    isFree={type.isFree}
                                    index={index}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            
                            {/* Selection acknowledgment */}
                            {selectedType && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
                              >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  {SelectedIcon && <SelectedIcon className="w-5 h-5 text-primary" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-primary">
                                    You selected: <span className="font-bold">{selectedType.title}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">{selectedType.description}</p>
                                </div>
                                <Check className="w-5 h-5 text-primary" />
                              </motion.div>
                            )}
                          </FormItem>
                        );
                      }}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="lg">Next Step</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Selected Role Banner */}
            {(() => {
              const selectedType = STAKEHOLDER_TYPES.find(t => t.value === formData.role);
              const SelectedIcon = selectedType?.icon;
              const rolePrice = selectedType?.isFree 
                ? { inr: "FREE", usd: "FREE" }
                : selectedType?.isProfessional 
                  ? { inr: "₹99/year", usd: "$1.99/year" }
                  : { inr: `₹${pricing.INR.toLocaleString()}/year`, usd: `$${pricing.USD}/year` };
              
              return selectedType ? (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`mb-6 rounded-xl overflow-hidden border-2 ${
                    selectedType.isFree 
                      ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-300"
                      : selectedType.isProfessional
                        ? "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-300"
                        : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          selectedType.isFree 
                            ? "bg-emerald-500/20 text-emerald-600"
                            : selectedType.isProfessional
                              ? "bg-purple-500/20 text-purple-600"
                              : "bg-primary/20 text-primary"
                        }`}
                      >
                        {SelectedIcon && <SelectedIcon className="w-7 h-7" />}
                      </motion.div>
                      <div className="flex-1">
                        <motion.p 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xs uppercase tracking-wide text-muted-foreground font-medium"
                        >
                          Your Selected Role
                        </motion.p>
                        <motion.h3 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 }}
                          className={`text-xl font-bold ${
                            selectedType.isFree 
                              ? "text-emerald-700 dark:text-emerald-400"
                              : selectedType.isProfessional
                                ? "text-purple-700 dark:text-purple-400"
                                : "text-primary"
                          }`}
                        >
                          {selectedType.title}
                        </motion.h3>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className={`text-right px-4 py-2 rounded-lg ${
                          selectedType.isFree 
                            ? "bg-emerald-500 text-white"
                            : selectedType.isProfessional
                              ? "bg-purple-500 text-white"
                              : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-wide opacity-80">Price</p>
                        <p className="text-lg font-bold">{rolePrice.inr}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : null;
            })()}
            
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Tell us a bit about yourself to get verified.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form2}>
                  <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
                    {/* Contact Info Section - Email OR Phone Required */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">Required:</span> Please provide either an email address or phone number (with country code)
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form2.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form2.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (with country code)</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form2.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form2.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation / Title <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CEO, Director, Founder, Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form2.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form2.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sector <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Sector" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {(form2.watch("sector") === OTHERS_SECTOR_VALUE || form2.watch("sector") === OTHERS_SUGGEST_VALUE) && (
                      <FormField
                        control={form2.control}
                        name="customSector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Sector Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your sector name (e.g., GovTech, DeepTech, NeuroTech)" 
                                {...field} 
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">
                              Please double-check your spelling. Your sector will be reviewed and may be added to our list.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form2.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Preferred Currency</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="USD" />
                                </FormControl>
                                <FormLabel className="font-normal">USD ($)</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="INR" />
                                </FormControl>
                                <FormLabel className="font-normal">INR (₹)</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Terms Acceptance Notice */}
                    <div className="bg-muted/50 p-3 rounded-lg text-sm border">
                      <p className="text-muted-foreground">
                        By proceeding, you agree to our{" "}
                        <a href="/terms" target="_blank" className="text-primary font-medium underline hover:text-primary/80">
                          Terms and Conditions
                        </a>
                        , including our Refund Policy and Privacy Policy. All prices are exclusive of applicable taxes.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : isFreeRole(formData.role) ? (
                          "Complete Free Registration"
                        ) : (
                          "Next Step"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Complete Registration</CardTitle>
                <CardDescription>Secure your spot on the global leaderboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-6 rounded-lg mb-6 border border-primary/20 text-center">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Annual Listing Fee</p>
                  <div className="text-4xl font-bold text-primary mb-1">
                    {formData.currency === "INR" ? `₹${pricing.INR}/year` : `$${pricing.USD}/year`}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Premium benefits included FREE as promotion</p>
                  <p className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full inline-block">
                    {formData.currency === "INR" 
                      ? "Price increases by ₹100/year after every 100 registrations until ₹999/year"
                      : "Price increases by $1.50/year after every 100 registrations until $14.99/year"}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-4 text-center">What You Get</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>Global Leaderboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>Verified Badge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span>Premium Profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Priority Support</span>
                    </div>
                  </div>
                </div>

                {/* Terms Reminder on Payment Step */}
                <div className="bg-muted/50 p-3 rounded-lg text-xs border mb-4">
                  <p className="text-muted-foreground text-center">
                    By completing payment, you confirm acceptance of our{" "}
                    <a href="/terms" target="_blank" className="text-primary underline hover:text-primary/80">Terms & Conditions</a>
                    , Refund Policy, and Privacy Policy. All payments are processed securely. 
                    Contact: support@i2u.ai | +91 7760937549
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-center text-muted-foreground">
                    {formData.currency === "INR" 
                      ? "Pay securely with Cashfree (UPI, Cards, Net Banking)" 
                      : "Pay securely with PayPal"}
                  </p>
                  
                  {isSubmitting ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Completing registration...</span>
                    </div>
                  ) : formData.currency === "INR" ? (
                    <CashfreeButton
                      amount={pricing.INR}
                      customerId={`user_${Date.now()}`}
                      customerName={formData.name || "User"}
                      customerEmail={formData.email || "user@example.com"}
                      customerPhone="9999999999"
                      onSuccess={(orderId, details) => handlePaymentSuccess({ orderId, ...details })}
                      onFailure={handlePaymentFailure}
                      className="w-full h-12 text-lg"
                    />
                  ) : (
                    <div className="flex justify-center" data-testid="paypal-button-container">
                      <PayPalButton
                        amount={pricing.USD.toString()}
                        currency="USD"
                        intent="CAPTURE"
                        onSuccess={handlePaymentSuccess}
                      />
                    </div>
                  )}
                </div>

                {/* Success message if already registered */}
                {formData.registered && (
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                    <p className="text-sm text-green-700 dark:text-green-300 text-center">
                      Your account has been created! Complete payment below or skip to access your dashboard now.
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-6 border-t mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleSkipPayment}>
                    Skip Payment for Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </PageWithSidePanels>
  );
}

function StepIndicator({ current, number, label }: { current: number, number: number, label: string }) {
  const isActive = current === number;
  const isCompleted = current > number;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
        isActive ? "bg-primary text-primary-foreground" : 
        isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
      }`}>
        {isCompleted ? <Check className="w-5 h-5" /> : number}
      </div>
      <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

interface RoleCardProps {
  value: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isProfessional: boolean;
  isFree: boolean;
  index: number;
}

function RoleCard({ value, title, description, icon: Icon, isProfessional, isFree, index }: RoleCardProps) {
  return (
    <FormItem className="space-y-0">
      <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:border-[3px] [&:has([data-state=checked])>div]:bg-primary/10 [&:has([data-state=checked])>div]:scale-[1.02] [&:has([data-state=checked])>div]:shadow-lg [&:has([data-state=checked])>div]:shadow-primary/20 [&:has([data-state=checked])_.check-indicator]:opacity-100 [&:has([data-state=checked])_.check-indicator]:scale-100">
        <FormControl>
          <RadioGroupItem value={value} className="sr-only" />
        </FormControl>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 h-full relative overflow-hidden group ${
            isFree 
              ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800"
              : isProfessional 
                ? "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800" 
                : "hover:bg-muted/50"
          }`}
        >
          {/* Selection checkmark indicator */}
          <div className="check-indicator absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center opacity-0 scale-75 transition-all duration-300">
            <Check className="w-4 h-4 text-white" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 ${
              isFree
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : isProfessional 
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400" 
                  : "bg-primary/10 text-primary"
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            
            <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            
            {isFree && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full"
              >
                <Trophy className="w-3 h-3" />
                FREE Forever
              </motion.div>
            )}
            
            {isProfessional && !isFree && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full"
              >
                <Star className="w-3 h-3" />
                Special Rate: ₹99/year
              </motion.div>
            )}
          </div>
        </motion.div>
      </FormLabel>
    </FormItem>
  );
}
