import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { ReferralCalculator } from "@/components/referral-calculator";
import { ValueCalculatorPopup } from "@/components/value-calculator";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";
import { GlobalCounters } from "@/components/global-counters";
import { 
  ArrowRight, 
  Briefcase,
  Users,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Network,
  Zap,
  CheckCircle,
  Star,
  GraduationCap,
  Lightbulb
} from "lucide-react";

const professionalCategories = [
  { title: "Mentors & Advisors", count: "2,500+", description: "Experienced professionals guiding startups", icon: <GraduationCap className="h-8 w-8" /> },
  { title: "Industry Experts", count: "1,800+", description: "Domain specialists across sectors", icon: <Lightbulb className="h-8 w-8" /> },
  { title: "Angel Investors", count: "950+", description: "Active investors seeking opportunities", icon: <TrendingUp className="h-8 w-8" /> },
  { title: "Service Providers", count: "1,200+", description: "Legal, finance, and tech services", icon: <Briefcase className="h-8 w-8" /> },
];

const benefits = [
  { title: "Startup Matching", description: "AI-powered matching with startups that need your expertise", icon: <Target className="h-6 w-6" /> },
  { title: "Global Network", description: "Connect with professionals from 85+ countries", icon: <Network className="h-6 w-6" /> },
  { title: "Visibility", description: "Showcase your expertise to thousands of startups", icon: <Star className="h-6 w-6" /> },
  { title: "Opportunities", description: "Access advisory roles, investments, and partnerships", icon: <Zap className="h-6 w-6" /> },
];

const pricingFeatures = [
  "Profile listing in Professional Directory",
  "AI-powered startup matching",
  "Direct messaging with startups",
  "Event invitations and networking",
  "Badge verification",
  "Priority support",
];

export default function ProfessionalsZone() {
  return (
    <PageWithSidePanels>
    <div className="flex flex-col items-center space-y-16 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-4xl px-4"
      >
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1 px-4">
          <Briefcase className="w-4 h-4 mr-2" />
          Professionals' Zone
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Empower Startups</span>
          <br />
          <span className="text-primary">With Your Expertise</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join our network of mentors, advisors, investors, and service providers shaping the next generation of unicorns.
        </p>

        <DynamicPricingBanner showBenefits={true} compact={true} stakeholderType="professional" />

        <GlobalCounters variant="professional-first" className="mt-4" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <ValueCalculatorPopup />
          <ReferralCalculator />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Special pricing for professionals: <span className="font-bold text-primary">₹99/year</span> (Regular: ₹999)
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Professional Categories</h2>
          <p className="text-muted-foreground">Find your place in our thriving ecosystem</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionalCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-primary/20 hover:border-primary/40">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {category.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{category.count}</p>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Why Join the Professionals' Zone?</h2>
          <p className="text-muted-foreground">Unlock opportunities to make an impact</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Badge className="bg-white/20 text-white mb-4">Special Pricing</Badge>
              <h3 className="text-3xl font-bold mb-2">Professional Membership</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">₹99</span>
                <span className="text-xl opacity-80">/year</span>
              </div>
              <p className="opacity-90 mb-2">or $1.49 USD/year</p>
              <p className="text-sm opacity-70">90% discount for professionals who support startups</p>
            </div>
            <CardContent className="p-8">
              <h4 className="font-semibold mb-4">What's Included:</h4>
              <ul className="space-y-3">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block mt-6">
                <Button className="w-full" size="lg" data-testid="button-register-professional">
                  Register as Professional <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="mt-4 flex justify-center">
                <ReferralCalculator />
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.section>

      <BlogInsightsSection />

      <RotatingInsightsQuotes variant="hero" className="my-8" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-muted/50">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Already 6,400+ Professionals</h2>
            <p className="text-muted-foreground mb-6">
              Join the growing community of professionals making a difference in the startup ecosystem.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">Mentors</Badge>
              <Badge variant="outline">Advisors</Badge>
              <Badge variant="outline">Investors</Badge>
              <Badge variant="outline">Consultants</Badge>
              <Badge variant="outline">Legal Experts</Badge>
              <Badge variant="outline">Finance Professionals</Badge>
              <Badge variant="outline">Tech Specialists</Badge>
              <Badge variant="outline">Marketing Experts</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}
