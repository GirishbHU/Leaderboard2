import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { ValueCalculator, ValueCalculatorPopup } from "@/components/value-calculator";
import { ReferralCalculator } from "@/components/referral-calculator";
import { DynamicPricingBanner, DynamicStatsBar } from "@/components/dynamic-pricing-banner";
import { AnimatedVCTicker } from "@/components/animated-vc-ticker";
import { AnimatedUnicornTicker } from "@/components/animated-unicorn-ticker";
import { GlobalCounters } from "@/components/global-counters";
import { 
  ArrowRight, 
  Trophy, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  Check,
  Sparkles,
  Target,
  Zap,
  Globe,
  Award,
  BookOpen,
  Network,
  Star,
  Rocket,
  Crown,
  Gift
} from "lucide-react";

const valueServices = [
  { name: "Professional Assessment", cost: "$15,000 to $30,000", icon: <Target className="h-6 w-6" /> },
  { name: "Multi-Method Valuation", cost: "$50,000 to $90,000", icon: <TrendingUp className="h-6 w-6" /> },
  { name: "Global Network Access", cost: "$30,000 to $60,000", icon: <Network className="h-6 w-6" /> },
  { name: "Recognition & Credibility", cost: "$20,000 to $30,000", icon: <Award className="h-6 w-6" /> },
  { name: "Educational Resources", cost: "$5,000 to $15,000", icon: <BookOpen className="h-6 w-6" /> },
];

const earlyAccessRewards = [
  { tier: "Top 1%", plan: "Pro Max Ultra", worth: "₹1,00,000/Year", description: "Ultimate career domination package", color: "from-yellow-500 to-amber-600" },
  { tier: "Next 2%", plan: "Professional", worth: "₹60,000/Year", description: "Complete brand building solution", color: "from-purple-500 to-violet-600" },
  { tier: "Next 3%", plan: "Advanced", worth: "₹36,000/Year", description: "Expert-level skill development", color: "from-blue-500 to-cyan-600" },
  { tier: "Next 4%", plan: "Basic", worth: "₹24,000/Year", description: "Professional identity building", color: "from-green-500 to-emerald-600" },
  { tier: "Next 90%", plan: "Beginner", worth: "₹16,000/Year", description: "Career acceleration starter", color: "from-gray-500 to-slate-600" },
];

const pricingPlans = [
  {
    name: "Beginner",
    price: "₹16,000",
    usdPrice: "$240",
    period: "Year",
    tagline: "Ignite Your Idea!",
    features: [
      "Basic Virtual Space",
      "1 Participation Credit",
      "1 Basic AI Assistant",
      "Basic Template Website",
      "1 Email ID",
      "100 MB Data Storage",
      "Online Resources Support"
    ],
    popular: false
  },
  {
    name: "Basic",
    price: "₹24,000",
    usdPrice: "$360",
    period: "Year",
    tagline: "Nurture Your Vision!",
    features: [
      "Customizable Virtual Office",
      "5 Participation Credits",
      "1 Advanced AI Assistant",
      "Customizable Template Website",
      "5 Email IDs",
      "1 GB Data Storage",
      "Access to Online Community",
      "AI-powered Chatbot"
    ],
    popular: false
  },
  {
    name: "Advanced",
    price: "₹36,000",
    usdPrice: "$540",
    period: "Year",
    tagline: "Accelerate Your Growth!",
    features: [
      "Advanced Virtual Office with AI",
      "10 Participation Credits",
      "2 Advanced AI Assistants",
      "Custom Design with E-commerce",
      "10 Email IDs",
      "5 GB Data Storage",
      "AI-powered Content Generation",
      "Exclusive Online Events"
    ],
    popular: true
  },
  {
    name: "Professional",
    price: "₹60,000",
    usdPrice: "$900",
    period: "Year",
    tagline: "Connect with Unicorns!",
    features: [
      "Premium Virtual Office with VR",
      "20 Participation Credits",
      "3 High-end AI Assistants",
      "AI-powered Content Generation",
      "20 Email IDs",
      "10 GB Data Storage",
      "Dedicated Unicorn Coach",
      "VIP Events Access"
    ],
    popular: false
  },
  {
    name: "Pro Max Ultra",
    price: "₹1,00,000",
    usdPrice: "$1,500",
    period: "Year",
    tagline: "Create Your Legacy!",
    features: [
      "Ultra-Premium Virtual Office",
      "50 Participation Credits",
      "5 Top-notch AI Assistants",
      "VR + AI Content Generation",
      "50 Email IDs",
      "50 GB Data Storage",
      "Unicorn Mentorship",
      "24/7 Dedicated AI Support"
    ],
    popular: false
  }
];

export default function Home() {
  return (
    <PageWithSidePanels>
    <div className="flex flex-col items-center space-y-16 py-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl text-center space-y-6 px-4"
      >
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1 px-4">
          Transform Your Startup's Future @ HyperSpeed
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-muted-foreground">90% of startups fail,</span>
          <br />
          <span className="text-primary">but most failures are preventable.</span>
        </h1>
        
        <DynamicPricingBanner showBenefits={true} />

        <GlobalCounters variant="full" className="mt-4" />
        <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
          <ValueCalculatorPopup />
          <Badge className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/30">
            <Gift className="h-3 w-3 mr-1" />
            Referral Bonus of 20%
          </Badge>
          <ReferralCalculator />
        </div>
      </motion.section>

      {/* Stats Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-5xl"
      >
        <DynamicStatsBar />
      </motion.section>

      {/* Top Unicorns Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Top Unicorns of 2025</h2>
          <p className="text-muted-foreground">Discover the world's most valuable startups</p>
        </div>
        <AnimatedUnicornTicker />
      </motion.section>

      {/* Top VCs Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Top VCs of 2025</h2>
          <p className="text-muted-foreground">Discover top venture capital firms across different funding stages</p>
        </div>
        <AnimatedVCTicker />
      </motion.section>

      {/* Why Trust Us */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="w-full max-w-4xl px-4 text-center"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-6">Why Trust Us?</h2>
            <div className="space-y-2 text-xl text-muted-foreground">
              <p>We know what startups <span className="text-primary font-semibold">need</span>.</p>
              <p>We know what startups <span className="text-primary font-semibold">want</span>.</p>
              <p>We know which startups can <span className="text-primary font-semibold">win</span>.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8" data-testid="button-register-trust">
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <ReferralCalculator />
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Interactive Value Calculator */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full"
      >
        <ValueCalculator />
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="w-full max-w-5xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Assess</h3>
            <p className="text-muted-foreground">98-point evaluation</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Valuate</h3>
            <p className="text-muted-foreground">5 professional methods</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Connect</h3>
            <p className="text-muted-foreground">Intelligent matching engine</p>
          </div>
        </div>
      </motion.section>

      {/* Early Access Rewards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            Exclusive Early Access Rewards
          </h2>
          <p className="text-muted-foreground">The first 10% of registrants get their annual subscription FREE!</p>
        </div>
        <div className="space-y-4">
          {earlyAccessRewards.map((reward, index) => (
            <Card key={index} className={`overflow-hidden ${index === 0 ? 'ring-2 ring-yellow-500' : ''}`}>
              <div className={`h-2 bg-gradient-to-r ${reward.color}`} />
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Badge className={`bg-gradient-to-r ${reward.color} text-white px-4 py-1`}>
                    {reward.tier}
                  </Badge>
                  <div>
                    <p className="font-bold">{reward.plan} Plan</p>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{reward.worth}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">FREE for 1 Year</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <p className="text-green-700 dark:text-green-400 font-medium">
            <Check className="inline h-4 w-4 mr-1" />
            Even if you miss the top tier, you still get at least ₹16,000 worth of value!
          </p>
        </div>
        <div className="text-center mt-4 p-4 bg-primary/5 rounded-lg">
          <p className="text-sm">
            <Rocket className="inline h-4 w-4 mr-1 text-primary" />
            <strong>Beat the system:</strong> Pay a little extra to become the highest-paying registrant of the day and jump the queue for top-tier rewards!
          </p>
        </div>
      </motion.section>

      {/* Pricing Plans */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="w-full max-w-7xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Star className="h-8 w-8 text-yellow-500" />
            Subscription Plans for Everyone
          </h2>
          <p className="text-muted-foreground">Choose from our comprehensive plans designed for Startups, Investors & VCs, Mentors & Advisors, Accelerators & Incubators, Service Providers, and Suppliers & Vendors</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                  <span className="text-sm text-primary font-medium ml-2">({plan.usdPrice}/{plan.period})</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} data-testid={`button-choose-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    Choose {plan.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Blog Insights Section */}
      <BlogInsightsSection />

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
          <CardContent className="py-12 text-center">
            <Rocket className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join i2u.ai, ₹999/year ($14.99/year) Today!</h2>
            <p className="text-lg opacity-90 mb-4 max-w-2xl mx-auto">
              Your annual listing fee gives you access to our premium resources, AI-powered tools, and global startup network. All benefits included FREE as promotion!
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6 max-w-lg mx-auto">
              <p className="text-sm font-medium mb-3">Annual Listing Fee Tiers:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-green-500/30 rounded-lg p-3 border-2 border-green-400">
                  <p className="font-bold text-lg">First 100: ₹999/year ($14.99/year)</p>
                  <p className="text-green-300 text-xs">← YOU ARE HERE - Best Price!</p>
                </div>
                <div className="bg-orange-500/20 rounded-lg p-2 border border-orange-400/50">
                  <p className="font-bold">101-500: ₹1,999/year ($29.99/year)</p>
                  <p className="text-orange-300 text-xs">2x price increase!</p>
                </div>
                <div className="bg-red-500/20 rounded-lg p-2 border border-red-400/50">
                  <p className="font-bold">501+: ₹2,999/year ($39.99/year) + $99 Assessment</p>
                  <p className="text-red-300 text-xs">3x price increase!</p>
                </div>
              </div>
              <p className="text-xs mt-3 opacity-80">Referral bonus: Earn on all spending by your referrals while you're subscribed!</p>
            </div>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold" data-testid="button-pay-now">
                Pay Now ₹999/year ($14.99/year) <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-4">
      <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
