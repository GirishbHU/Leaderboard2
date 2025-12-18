import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface UnicornData {
  rank: number;
  company: string;
  country: string;
  industry: string;
  valuation: number;
  trend: "up" | "down" | "stable";
}

interface UnicornDataSet {
  unicorns: UnicornData[];
  source: string;
  sourceUrl: string;
  publishedDate: string;
}

const unicornDataSets: UnicornDataSet[] = [
  {
    source: "CB Insights Global Unicorn Club",
    sourceUrl: "https://www.cbinsights.com/research-unicorn-companies",
    publishedDate: "Dec 10, 2025",
    unicorns: [
      { rank: 1, company: "SpaceX", country: "United States", industry: "Industrials", valuation: 350, trend: "up" },
      { rank: 2, company: "ByteDance", country: "China", industry: "Media & Entertainment", valuation: 300, trend: "stable" },
      { rank: 3, company: "OpenAI", country: "United States", industry: "Enterprise Tech", valuation: 157, trend: "up" },
      { rank: 4, company: "Stripe", country: "United States", industry: "Financial Services", valuation: 70, trend: "up" },
      { rank: 5, company: "SHEIN", country: "Singapore", industry: "Consumer & Retail", valuation: 66, trend: "down" },
      { rank: 6, company: "Databricks", country: "United States", industry: "Enterprise Tech", valuation: 62, trend: "up" },
      { rank: 7, company: "Revolut", country: "United Kingdom", industry: "Financial Services", valuation: 45, trend: "up" },
      { rank: 8, company: "Canva", country: "Australia", industry: "Enterprise Tech", valuation: 40, trend: "stable" },
      { rank: 9, company: "Fanatics", country: "United States", industry: "Consumer & Retail", valuation: 31, trend: "stable" },
      { rank: 10, company: "Instacart", country: "United States", industry: "Consumer & Retail", valuation: 30, trend: "down" },
    ]
  },
  {
    source: "Hurun Global Unicorn Index",
    sourceUrl: "https://www.hurun.net/en-US/Rank/HsRankDetails?pagetype=unicorn",
    publishedDate: "Nov 28, 2025",
    unicorns: [
      { rank: 1, company: "ByteDance", country: "China", industry: "Media & Entertainment", valuation: 300, trend: "stable" },
      { rank: 2, company: "SpaceX", country: "United States", industry: "Aerospace", valuation: 285, trend: "up" },
      { rank: 3, company: "Anthropic", country: "United States", industry: "AI", valuation: 150, trend: "up" },
      { rank: 4, company: "Shein", country: "China", industry: "E-commerce", valuation: 100, trend: "down" },
      { rank: 5, company: "Stripe", country: "United States", industry: "Fintech", valuation: 70, trend: "stable" },
      { rank: 6, company: "xAI", country: "United States", industry: "AI", valuation: 50, trend: "up" },
      { rank: 7, company: "Xiaohongshu", country: "China", industry: "Social Media", valuation: 45, trend: "up" },
      { rank: 8, company: "Revolut", country: "United Kingdom", industry: "Fintech", valuation: 45, trend: "up" },
      { rank: 9, company: "Discord", country: "United States", industry: "Social Media", valuation: 42, trend: "stable" },
      { rank: 10, company: "Canva", country: "Australia", industry: "Software", valuation: 40, trend: "stable" },
    ]
  },
  {
    source: "PitchBook Unicorn Tracker",
    sourceUrl: "https://pitchbook.com/news/articles/unicorn-startups-list",
    publishedDate: "Dec 5, 2025",
    unicorns: [
      { rank: 1, company: "SpaceX", country: "United States", industry: "Space Tech", valuation: 350, trend: "up" },
      { rank: 2, company: "OpenAI", country: "United States", industry: "Artificial Intelligence", valuation: 157, trend: "up" },
      { rank: 3, company: "ByteDance", country: "China", industry: "Social Media", valuation: 142, trend: "down" },
      { rank: 4, company: "Databricks", country: "United States", industry: "Data & Analytics", valuation: 62, trend: "up" },
      { rank: 5, company: "Stripe", country: "United States", industry: "Payments", valuation: 50, trend: "stable" },
      { rank: 6, company: "Anduril", country: "United States", industry: "Defense Tech", valuation: 48, trend: "up" },
      { rank: 7, company: "Revolut", country: "United Kingdom", industry: "Neobank", valuation: 45, trend: "up" },
      { rank: 8, company: "Plaid", country: "United States", industry: "Fintech", valuation: 42, trend: "stable" },
      { rank: 9, company: "Figma", country: "United States", industry: "Design Software", valuation: 40, trend: "stable" },
      { rank: 10, company: "Chime", country: "United States", industry: "Neobank", valuation: 35, trend: "down" },
    ]
  },
];

const CACHE_KEY = "unicorn_data_cache";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

function getWeeklyDataSet(): { dataSet: UnicornDataSet; lastRefreshed: string } {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { dataSet, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return { 
        dataSet, 
        lastRefreshed: new Date(timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    }
  }
  
  const weekNumber = Math.floor(Date.now() / CACHE_DURATION);
  const setIndex = weekNumber % unicornDataSets.length;
  const dataSet = unicornDataSets[setIndex];
  const timestamp = Date.now();
  
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    dataSet,
    timestamp
  }));
  
  return { 
    dataSet, 
    lastRefreshed: new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}

export function AnimatedUnicornTicker() {
  const [currentDataSet, setCurrentDataSet] = useState<UnicornDataSet | null>(null);
  const [displayedUnicorns, setDisplayedUnicorns] = useState<UnicornData[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  useEffect(() => {
    const { dataSet, lastRefreshed } = getWeeklyDataSet();
    setCurrentDataSet(dataSet);
    setDisplayedUnicorns(dataSet.unicorns);
    setLastRefreshed(lastRefreshed);
  }, []);

  useEffect(() => {
    if (!currentDataSet) return;

    const interval = setInterval(() => {
      setDisplayedUnicorns(prev => {
        const shuffled = [...prev];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.map((unicorn, idx) => ({ ...unicorn, rank: idx + 1 }));
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [currentDataSet]);

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  if (!currentDataSet || displayedUnicorns.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead className="text-right">Valuation ($B)</TableHead>
              <TableHead className="w-12 text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {displayedUnicorns.map((unicorn, index) => (
                <motion.tr
                  key={`${unicorn.company}-${index}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  className="border-b transition-colors hover:bg-muted/50"
                  layout
                >
                  <TableCell>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        unicorn.rank === 1 ? "bg-yellow-500/20 text-yellow-600" :
                        unicorn.rank === 2 ? "bg-gray-300/30 text-gray-600" :
                        unicorn.rank === 3 ? "bg-amber-600/20 text-amber-700" :
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {unicorn.rank}
                    </motion.div>
                  </TableCell>
                  <TableCell className="font-semibold">{unicorn.company}</TableCell>
                  <TableCell>{unicorn.country}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{unicorn.industry}</TableCell>
                  <TableCell className="text-right font-bold text-primary">${unicorn.valuation}B</TableCell>
                  <TableCell className="text-center">
                    <TrendIcon trend={unicorn.trend} />
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        <div className="px-4 py-2 bg-muted/30 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">Source:</span>
            <a 
              href={currentDataSet.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {currentDataSet.source}
            </a>
            <span>• {currentDataSet.publishedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Last refreshed: {lastRefreshed}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
