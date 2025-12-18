import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlogInsightsSection } from "@/components/blog-insights-section";
import { RotatingInsightsQuotes } from "@/components/rotating-insights-quotes";
import { ReferralCalculator } from "@/components/referral-calculator";
import { ValueCalculatorPopup } from "@/components/value-calculator";
import { DynamicPricingBanner } from "@/components/dynamic-pricing-banner";
import { PageWithSidePanels } from "@/components/page-with-sidepanels";
import { 
  ArrowRight, 
  Trophy,
  TrendingUp,
  Globe,
  Rocket,
  Star,
  Crown,
  Target,
  Zap,
  Award,
  Info,
  Lock
} from "lucide-react";

const topStartupLeaders = [
  { rank: 1, name: "Elon Musk", company: "SpaceX / Tesla", country: "USA", sector: "Tech & Automotive", valuation: "$350B+", badge: "Visionary" },
  { rank: 2, name: "Jensen Huang", company: "NVIDIA", country: "USA", sector: "AI & Semiconductors", valuation: "$2T+", badge: "AI Pioneer" },
  { rank: 3, name: "Sam Altman", company: "OpenAI", country: "USA", sector: "Artificial Intelligence", valuation: "$150B", badge: "Innovator" },
  { rank: 4, name: "Brian Chesky", company: "Airbnb", country: "USA", sector: "Travel & Hospitality", valuation: "$85B", badge: "Disruptor" },
  { rank: 5, name: "Patrick Collison", company: "Stripe", country: "Ireland", sector: "Fintech", valuation: "$70B", badge: "Builder" },
  { rank: 6, name: "Ritesh Agarwal", company: "OYO", country: "India", sector: "Hospitality", valuation: "$9B", badge: "Young Leader" },
  { rank: 7, name: "Byju Raveendran", company: "BYJU'S", country: "India", sector: "EdTech", valuation: "$22B", badge: "Educator" },
  { rank: 8, name: "Whitney Wolfe Herd", company: "Bumble", country: "USA", sector: "Social Tech", valuation: "$8B", badge: "Trailblazer" },
  { rank: 9, name: "Vlad Tenev", company: "Robinhood", country: "USA", sector: "Fintech", valuation: "$12B", badge: "Democratizer" },
  { rank: 10, name: "Tony Xu", company: "DoorDash", country: "USA", sector: "Food Delivery", valuation: "$45B", badge: "Operator" },
];

const leadershipStats = [
  { value: "10,000+", label: "Startup Leaders Registered" },
  { value: "85+", label: "Countries Represented" },
  { value: "$500B+", label: "Combined Valuation" },
  { value: "35%", label: "Average Growth Rate" },
];

const benefits = [
  { title: "Global Recognition", description: "Get featured on our global leaderboard seen by top VCs and investors", icon: <Globe className="h-6 w-6" /> },
  { title: "Network Access", description: "Connect with fellow startup leaders and industry veterans", icon: <Rocket className="h-6 w-6" /> },
  { title: "Mentorship", description: "Access to exclusive mentorship from unicorn founders", icon: <Star className="h-6 w-6" /> },
  { title: "Funding Opportunities", description: "Priority introductions to top venture capital firms", icon: <TrendingUp className="h-6 w-6" /> },
];

export default function StartupLeaders() {
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
          <Rocket className="w-4 h-4 mr-2" />
          Startup Leaders Leaderboard
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Meet the World's</span>
          <br />
          <span className="text-primary">Top Startup Leaders</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and connect with visionary founders who are shaping the future of technology and innovation.
        </p>

        <DynamicPricingBanner showBenefits={true} compact={true} />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <ValueCalculatorPopup />
          <Link href="/register">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold" data-testid="button-join-leaders">
              Join the Leaderboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <ReferralCalculator />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-5xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/20">
          {leadershipStats.map((stat, index) => (
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 py-1 px-3">
              <Info className="w-3 h-3 mr-1" />
              Indicative Leaderboard
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Top Startup Leaders 2025
          </h2>
          <p className="text-muted-foreground">The most influential founders driving global innovation</p>
          <p className="text-sm text-muted-foreground/70 mt-2 italic">
            Sample data for illustration purposes. Registered members get access to the real leaderboard.
          </p>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead className="text-right">Valuation</TableHead>
                  <TableHead>Badge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStartupLeaders.map((leader) => (
                  <TableRow key={leader.rank} data-testid={`leader-row-${leader.rank}`}>
                    <TableCell>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        leader.rank === 1 ? "bg-yellow-500/20 text-yellow-600" :
                        leader.rank === 2 ? "bg-gray-300/30 text-gray-600" :
                        leader.rank === 3 ? "bg-amber-600/20 text-amber-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {leader.rank <= 3 ? <Crown className="h-4 w-4" /> : leader.rank}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{leader.name}</TableCell>
                    <TableCell>{leader.company}</TableCell>
                    <TableCell>{leader.country}</TableCell>
                    <TableCell className="text-muted-foreground">{leader.sector}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{leader.valuation}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {leader.badge}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Access the Real Leaderboard</p>
                <p className="text-sm text-muted-foreground">Register to see actual rankings and connect with founders</p>
              </div>
            </div>
            <Link href="/register">
              <Button className="whitespace-nowrap">
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-6xl px-4"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Why Join as a Startup Leader?</h2>
          <p className="text-muted-foreground">Unlock exclusive benefits designed for ambitious founders</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <BlogInsightsSection />

      <RotatingInsightsQuotes variant="hero" className="my-8" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Lead?</h2>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of startup leaders building the future. Get ranked, get noticed, get funded.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold" data-testid="button-register-leader">
                  Register Now for ₹999/year <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <ReferralCalculator />
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}
