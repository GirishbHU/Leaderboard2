import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { GlobalCounters } from "@/components/global-counters";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";
import { 
  ArrowRight, 
  Info,
  Target,
  Users,
  Globe,
  Lightbulb,
  Heart,
  Rocket,
  Award,
  TrendingUp
} from "lucide-react";

const stats = [
  { value: "10,000+", label: "Startups Registered" },
  { value: "85+", label: "Countries" },
  { value: "6,400+", label: "Professionals" },
  { value: "$500B+", label: "Combined Valuation" },
];

const values = [
  { 
    title: "Innovation First", 
    description: "We believe in the power of ideas to change the world",
    icon: <Lightbulb className="h-6 w-6" />
  },
  { 
    title: "Global Community", 
    description: "Building bridges across borders to connect entrepreneurs worldwide",
    icon: <Globe className="h-6 w-6" />
  },
  { 
    title: "Integrity", 
    description: "Transparent, honest, and ethical in everything we do",
    icon: <Heart className="h-6 w-6" />
  },
  { 
    title: "Excellence", 
    description: "Committed to providing world-class services and support",
    icon: <Award className="h-6 w-6" />
  },
];

const team = [
  { name: "Leadership Team", role: "Experienced entrepreneurs and industry veterans" },
  { name: "Advisory Board", role: "Global experts from top VCs and unicorns" },
  { name: "Technology Team", role: "AI and platform specialists from leading tech companies" },
  { name: "Community Team", role: "Dedicated professionals supporting our ecosystem" },
];

export default function About() {
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
          <Info className="w-4 h-4 mr-2" />
          About Us
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Ideas to Unicorns</span>
          <br />
          <span className="text-primary">Through AI</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          i2u.ai is the world's most comprehensive AI-powered startup ecosystem platform, 
          connecting founders, investors, and professionals to build the unicorns of tomorrow.
        </p>

        <DynamicPricingBanner showBenefits={false} compact={true} />
        <GlobalCounters variant="full" className="mt-4" showButton={true} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-5xl px-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Born from a simple observation: 90% of startups fail, but most of these failures are preventable. 
                We set out to change this by creating a platform that gives every startup the tools, connections, 
                and insights they need to succeed.
              </p>
              <p>
                Leveraging cutting-edge AI technology, we've built a comprehensive ecosystem that assesses, 
                valuates, and connects startups with the right investors, mentors, and resources at the right time.
              </p>
              <p>
                Today, i2u.ai serves startups across 85+ countries, with a combined portfolio valuation 
                exceeding $500 billion. Our mission? To help transform a million ideas into unicorns.
              </p>
            </div>
          </div>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-8">
              <Rocket className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Why "i2u.ai"?</h3>
              <p className="text-muted-foreground">
                <strong>i</strong> = Ideas<br />
                <strong>2</strong> = To<br />
                <strong>u</strong> = Unicorns<br />
                <strong>.ai</strong> = Through AI<br /><br />
                Every great company starts with an idea. We use AI to help transform those ideas into unicorns.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we do</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Team</h2>
          <p className="text-muted-foreground">Passionate people building the future of startups</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <BlogInsightsSection />

      <RotatingInsightsQuotes variant="default" className="my-8" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Whether you're a startup founder, investor, or professional, there's a place for you in our ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="secondary" size="lg" data-testid="button-register-about">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" data-testid="button-contact-about">
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}
