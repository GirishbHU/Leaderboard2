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
  Target,
  Rocket,
  Globe,
  Lightbulb,
  Users,
  TrendingUp,
  Heart,
  Sparkles,
  CheckCircle
} from "lucide-react";

const missionPillars = [
  {
    title: "Democratize Access",
    description: "Make world-class startup resources accessible to founders everywhere, regardless of location or background",
    icon: <Globe className="h-8 w-8" />
  },
  {
    title: "AI-Powered Growth",
    description: "Leverage artificial intelligence to provide personalized insights, matching, and guidance at scale",
    icon: <Lightbulb className="h-8 w-8" />
  },
  {
    title: "Global Connections",
    description: "Build bridges between startups, investors, and professionals across 85+ countries",
    icon: <Users className="h-8 w-8" />
  },
  {
    title: "Reduce Failure Rate",
    description: "Help startups avoid common pitfalls and increase their chances of success from 10% to 50%+",
    icon: <TrendingUp className="h-8 w-8" />
  },
];

const goals = [
  "Transform 1 million ideas into successful startups",
  "Connect 100,000 founders with the right investors",
  "Build a network of 50,000 mentors and advisors",
  "Create 10 million jobs through startup growth",
  "Generate $1 trillion in combined startup valuation",
];

const impactAreas = [
  { area: "Economic Growth", impact: "Fueling innovation and job creation worldwide" },
  { area: "Social Impact", impact: "Supporting startups solving global challenges" },
  { area: "Education", impact: "Providing resources and knowledge to entrepreneurs" },
  { area: "Diversity", impact: "Promoting inclusive entrepreneurship across all backgrounds" },
];

export default function Mission() {
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
          <Target className="w-4 h-4 mr-2" />
          Our Mission
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Transforming Ideas</span>
          <br />
          <span className="text-primary">Into Unicorns</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our mission is to empower entrepreneurs worldwide by providing the tools, connections, 
          and insights needed to build successful, world-changing companies.
        </p>

        <DynamicPricingBanner showBenefits={false} compact={true} />
        <GlobalCounters variant="full" className="mt-4" showButton={true} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-6xl px-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-12 text-center">
            <Rocket className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">90% of startups fail.</h2>
            <p className="text-xl text-muted-foreground mb-2">But most of these failures are preventable.</p>
            <p className="text-lg text-primary font-semibold">We're here to change that.</p>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Mission Pillars</h2>
          <p className="text-muted-foreground">The four foundations of everything we do</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missionPillars.map((pillar, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.description}</p>
                  </div>
                </div>
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            Our Vision Goals
          </h2>
          <p className="text-muted-foreground">What we're working towards</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <ul className="space-y-4">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-lg">{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Impact</h2>
          <p className="text-muted-foreground">Creating positive change across multiple dimensions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactAreas.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-6">
                <Heart className="h-8 w-8 mx-auto text-primary mb-3" />
                <h3 className="font-bold mb-2">{item.area}</h3>
                <p className="text-sm text-muted-foreground">{item.impact}</p>
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
            <Target className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Be Part of the Mission</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Join thousands of founders, investors, and professionals who share our vision 
              of a world where great ideas have the support they need to succeed.
            </p>
            <Link href="/register">
              <Button variant="secondary" size="lg" data-testid="button-join-mission">
                Join the Movement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}
