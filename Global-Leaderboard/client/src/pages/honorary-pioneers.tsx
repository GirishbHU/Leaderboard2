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
  Award,
  Star,
  Crown,
  Sparkles,
  Trophy,
  Heart,
  Globe,
  Lightbulb,
  Users,
  ExternalLink
} from "lucide-react";

const honoraryPioneers = [
  { 
    name: "Dr. Suhas Wamanrao Kulkarni", 
    title: "Retired Professor in Microbiology", 
    contribution: "Dedicated educator and researcher inspiring future scientists",
    category: "Science & Education",
    country: "India",
    link: "https://ws.i2u.ai/#/Honorary-Pioneers"
  },
  { 
    name: "Dr. A.P.J. Abdul Kalam", 
    title: "The Missile Man of India", 
    contribution: "Inspired millions of young minds to dream big and innovate",
    category: "Science & Innovation",
    country: "India"
  },
  { 
    name: "Steve Jobs", 
    title: "Co-founder of Apple", 
    contribution: "Revolutionized personal computing, mobile phones, and digital entertainment",
    category: "Technology",
    country: "USA"
  },
  { 
    name: "Narayana Murthy", 
    title: "Co-founder of Infosys", 
    contribution: "Pioneer of Indian IT industry and ethical business practices",
    category: "Technology & Business",
    country: "India"
  },
  { 
    name: "Bill Gates", 
    title: "Co-founder of Microsoft", 
    contribution: "Transformed personal computing and global philanthropy",
    category: "Technology & Philanthropy",
    country: "USA"
  },
  { 
    name: "Ratan Tata", 
    title: "Chairman Emeritus of Tata Sons", 
    contribution: "Globalized Indian industry while maintaining ethical values",
    category: "Industry & Philanthropy",
    country: "India"
  },
  { 
    name: "Jack Ma", 
    title: "Co-founder of Alibaba", 
    contribution: "Democratized e-commerce and inspired Asian entrepreneurs",
    category: "E-commerce",
    country: "China"
  },
];

const categories = [
  { name: "Technology Pioneers", count: 45, icon: <Lightbulb className="h-6 w-6" /> },
  { name: "Business Leaders", count: 38, icon: <Trophy className="h-6 w-6" /> },
  { name: "Social Innovators", count: 28, icon: <Heart className="h-6 w-6" /> },
  { name: "Global Visionaries", count: 22, icon: <Globe className="h-6 w-6" /> },
];

export default function HonoraryPioneers() {
  return (
    <PageWithSidePanels>
    <div className="flex flex-col items-center space-y-16 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-4xl px-4"
      >
        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 text-sm py-1 px-4">
          <Award className="w-4 h-4 mr-2" />
          Hall of Fame
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">Honorary</span>
          <br />
          <span className="text-primary">Pioneers</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Celebrating the visionaries who paved the way for today's innovators and entrepreneurs.
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                <p className="text-2xl font-bold text-primary">{category.count}</p>
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
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            Featured Pioneers
          </h2>
          <p className="text-muted-foreground">Leaders who changed the world</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {honoraryPioneers.map((pioneer, index) => {
            const cardContent = (
              <Card key={index} className={`hover:shadow-lg transition-shadow overflow-hidden group ${pioneer.link ? 'cursor-pointer' : ''}`}>
                <div className="h-2 bg-gradient-to-r from-yellow-500 to-amber-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{pioneer.country}</Badge>
                      {pioneer.link && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{pioneer.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{pioneer.title}</p>
                  <p className="text-sm text-muted-foreground mb-3">{pioneer.contribution}</p>
                  <Badge className="bg-primary/10 text-primary text-xs">{pioneer.category}</Badge>
                </CardContent>
              </Card>
            );
            
            return pioneer.link ? (
              <a key={index} href={pioneer.link} target="_blank" rel="noopener noreferrer" className="block">
                {cardContent}
              </a>
            ) : cardContent;
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-4xl px-4"
      >
        <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
            <h2 className="text-2xl font-bold mb-4">Nominate a Pioneer</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Know someone who has made exceptional contributions to the startup ecosystem? 
              Nominate them to be recognized as an Honorary Pioneer.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600" data-testid="button-nominate-pioneer">
                Submit a Nomination <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.section>

      <BlogInsightsSection />

      <RotatingInsightsQuotes variant="hero" className="my-8" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl px-4 text-center"
      >
        <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-4">Standing on the Shoulders of Giants</h2>
        <p className="text-muted-foreground mb-6">
          At i2u.ai, we believe in honoring those who came before us. These pioneers created the foundations 
          upon which today's startups build. Their vision, courage, and perseverance continue to inspire 
          the next generation of entrepreneurs.
        </p>
        <Link href="/register">
          <Button variant="outline" size="lg" data-testid="button-join-journey">
            Join the Journey <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.section>
    </div>
    </PageWithSidePanels>
  );
}
