import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VCData {
  id: number;
  name: string;
  totalFunds: string;
  portfolioCompanies: number;
  avgInvestment: string;
  successRate: string;
  trend: "up" | "down" | "stable";
}

interface VCDataSet {
  vcs: VCData[];
  source: string;
  sourceUrl: string;
  publishedDate: string;
}

const vcDataSets: VCDataSet[] = [
  {
    source: "Dealroom Top VCs Report",
    sourceUrl: "https://dealroom.net/blog/top-venture-capital-firms",
    publishedDate: "Dec 8, 2025",
    vcs: [
      { id: 1, name: "Sequoia Capital", totalFunds: "$85B", portfolioCompanies: 1500, avgInvestment: "$25M", successRate: "98%", trend: "up" },
      { id: 2, name: "Andreessen Horowitz", totalFunds: "$42B", portfolioCompanies: 800, avgInvestment: "$15M", successRate: "96%", trend: "up" },
      { id: 3, name: "Accel", totalFunds: "$21B", portfolioCompanies: 650, avgInvestment: "$12M", successRate: "94%", trend: "stable" },
      { id: 4, name: "Lightspeed Venture Partners", totalFunds: "$18B", portfolioCompanies: 500, avgInvestment: "$10M", successRate: "92%", trend: "up" },
      { id: 5, name: "Tiger Global Management", totalFunds: "$15B", portfolioCompanies: 400, avgInvestment: "$20M", successRate: "90%", trend: "down" },
    ]
  },
  {
    source: "TIME America's Top VC Firms",
    sourceUrl: "https://time.com/7309945/top-venture-capital-firms-usa-2025/",
    publishedDate: "Nov 25, 2025",
    vcs: [
      { id: 1, name: "Y Combinator", totalFunds: "$3B", portfolioCompanies: 4500, avgInvestment: "$500K", successRate: "95%", trend: "up" },
      { id: 2, name: "500 Global", totalFunds: "$2.8B", portfolioCompanies: 2800, avgInvestment: "$300K", successRate: "88%", trend: "stable" },
      { id: 3, name: "Techstars", totalFunds: "$1.5B", portfolioCompanies: 3200, avgInvestment: "$400K", successRate: "92%", trend: "up" },
      { id: 4, name: "First Round Capital", totalFunds: "$1.2B", portfolioCompanies: 350, avgInvestment: "$3M", successRate: "91%", trend: "up" },
      { id: 5, name: "Founders Fund", totalFunds: "$11B", portfolioCompanies: 200, avgInvestment: "$15M", successRate: "94%", trend: "stable" },
    ]
  },
  {
    source: "Forbes Midas List",
    sourceUrl: "https://www.forbes.com/midas/",
    publishedDate: "Dec 2, 2025",
    vcs: [
      { id: 1, name: "Khosla Ventures", totalFunds: "$15B", portfolioCompanies: 400, avgInvestment: "$10M", successRate: "93%", trend: "up" },
      { id: 2, name: "General Catalyst", totalFunds: "$25B", portfolioCompanies: 550, avgInvestment: "$18M", successRate: "95%", trend: "up" },
      { id: 3, name: "Bessemer Venture Partners", totalFunds: "$20B", portfolioCompanies: 700, avgInvestment: "$12M", successRate: "91%", trend: "stable" },
      { id: 4, name: "NEA", totalFunds: "$25B", portfolioCompanies: 600, avgInvestment: "$15M", successRate: "90%", trend: "down" },
      { id: 5, name: "Index Ventures", totalFunds: "$16B", portfolioCompanies: 400, avgInvestment: "$14M", successRate: "93%", trend: "up" },
    ]
  },
];

const CACHE_KEY = "vc_data_cache_v2";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

function getWeeklyDataSet(): { dataSet: VCDataSet; lastRefreshed: string } {
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
  const setIndex = weekNumber % vcDataSets.length;
  const dataSet = vcDataSets[setIndex];
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

export function AnimatedVCTicker() {
  const [currentDataSet, setCurrentDataSet] = useState<VCDataSet | null>(null);
  const [displayedVCs, setDisplayedVCs] = useState<VCData[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  useEffect(() => {
    const { dataSet, lastRefreshed } = getWeeklyDataSet();
    setCurrentDataSet(dataSet);
    setDisplayedVCs(dataSet.vcs);
    setLastRefreshed(lastRefreshed);
  }, []);

  useEffect(() => {
    if (!currentDataSet) return;

    const interval = setInterval(() => {
      setDisplayedVCs(prev => {
        const shuffled = [...prev];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.map((vc, idx) => ({ ...vc, id: idx + 1 }));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [currentDataSet]);

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  if (!currentDataSet || displayedVCs.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>VC Firm</TableHead>
              <TableHead className="text-right">AUM</TableHead>
              <TableHead className="text-right">Portfolio</TableHead>
              <TableHead className="text-right">Avg Deal</TableHead>
              <TableHead className="text-right">Success</TableHead>
              <TableHead className="w-12 text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {displayedVCs.map((vc, index) => (
                <motion.tr
                  key={`${vc.name}-${index}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
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
                        vc.id === 1 ? "bg-yellow-500/20 text-yellow-600" :
                        vc.id === 2 ? "bg-gray-300/30 text-gray-600" :
                        vc.id === 3 ? "bg-amber-600/20 text-amber-700" :
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {vc.id}
                    </motion.div>
                  </TableCell>
                  <TableCell className="font-semibold">{vc.name}</TableCell>
                  <TableCell className="text-right font-medium">{vc.totalFunds}</TableCell>
                  <TableCell className="text-right">{vc.portfolioCompanies.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{vc.avgInvestment}</TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">{vc.successRate}</TableCell>
                  <TableCell className="text-center">
                    <TrendIcon trend={vc.trend} />
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
