import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface CounterStats {
  ecosystemCount: number;
  professionalCount: number;
  totalCount: number;
}

const ECOSYSTEM_COLOR = "bg-blue-600";
const ECOSYSTEM_BG = "from-blue-600/15 to-blue-700/15";
const ECOSYSTEM_BORDER = "border-blue-600/30";

const PROFESSIONAL_COLOR = "bg-orange-500";
const PROFESSIONAL_BG = "from-orange-500/15 to-orange-600/15";
const PROFESSIONAL_BORDER = "border-orange-500/30";

const TOTAL_COLOR = "bg-emerald-500";
const TOTAL_BG = "from-emerald-500/15 to-emerald-600/15";
const TOTAL_BORDER = "border-emerald-500/30";

function AnimatedCounter({ count, label, icon: Icon, color }: { count: number; label: string; icon: any; color: string }) {
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const stepValue = count / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(stepValue * currentStep));
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [count]);
  
  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-full ${color}`}>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span 
          key={displayCount}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="font-bold text-sm"
        >
          {displayCount.toLocaleString()}
        </motion.span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

interface GlobalCountersProps {
  variant?: "inline" | "card" | "minimal" | "stacked" | "full" | "professional-first";
  className?: string;
  showTotal?: boolean;
  showButton?: boolean;
}

export function GlobalCounters({ variant = "inline", className = "", showTotal = true, showButton = true }: GlobalCountersProps) {
  const [stats, setStats] = useState<CounterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ecosystemRes, professionalRes] = await Promise.all([
          fetch("/api/pricing/dynamic-stats?stakeholderType=ecosystem"),
          fetch("/api/pricing/dynamic-stats?stakeholderType=professional")
        ]);
        
        const ecosystemData = await ecosystemRes.json();
        const professionalData = await professionalRes.json();
        
        setStats({
          ecosystemCount: ecosystemData.signupCount || 0,
          professionalCount: professionalData.signupCount || 0,
          totalCount: (ecosystemData.signupCount || 0) + (professionalData.signupCount || 0)
        });
      } catch (error) {
        console.error("Failed to fetch counter stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 w-48 bg-muted rounded"></div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-4 text-sm ${className}`}>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-blue-600" />
          <span className="font-semibold">{stats.ecosystemCount.toLocaleString()}</span>
          <span className="text-muted-foreground">Ecosystem</span>
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5 text-orange-500" />
          <span className="font-semibold">{stats.professionalCount.toLocaleString()}</span>
          <span className="text-muted-foreground">Professionals</span>
        </span>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className={`bg-gradient-to-r ${ECOSYSTEM_BG} border ${ECOSYSTEM_BORDER} rounded-lg px-5 py-2.5`}>
          <AnimatedCounter 
            count={stats.ecosystemCount} 
            label="Ecosystem Partners" 
            icon={Users} 
            color={ECOSYSTEM_COLOR} 
          />
        </div>
        
        {showButton && (
          <Link href="/register">
            <Button 
              size="lg" 
              className="gap-3 h-16 px-12 text-xl font-bold shadow-[0_6px_0_0_rgb(22,101,52)] hover:shadow-[0_4px_0_0_rgb(22,101,52)] active:shadow-[0_0px_0_0_rgb(22,101,52)] bg-green-600 hover:bg-green-500 active:bg-green-700 transform hover:-translate-y-0.5 active:translate-y-1 transition-all duration-150 border-0"
            >
              Join the Leaderboard <ArrowRight className="h-7 w-7" />
            </Button>
          </Link>
        )}
        
        {showTotal && (
          <div className={`bg-gradient-to-r ${TOTAL_BG} border ${TOTAL_BORDER} rounded-lg px-5 py-2`}>
            <AnimatedCounter 
              count={stats.totalCount} 
              label="Total Members" 
              icon={TrendingUp} 
              color={TOTAL_COLOR} 
            />
          </div>
        )}
        
        <Link href="/professionals-zone">
          <div className={`bg-gradient-to-r ${PROFESSIONAL_BG} border ${PROFESSIONAL_BORDER} rounded-lg px-5 py-2.5 cursor-pointer hover:scale-105 transition-transform`}>
            <AnimatedCounter 
              count={stats.professionalCount} 
              label="Professionals" 
              icon={Briefcase} 
              color={PROFESSIONAL_COLOR} 
            />
          </div>
        </Link>
      </div>
    );
  }

  if (variant === "professional-first") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className={`bg-gradient-to-r ${PROFESSIONAL_BG} border ${PROFESSIONAL_BORDER} rounded-lg px-5 py-2.5`}>
          <AnimatedCounter 
            count={stats.professionalCount} 
            label="Professionals" 
            icon={Briefcase} 
            color={PROFESSIONAL_COLOR} 
          />
        </div>
        
        {showButton && (
          <Link href="/register">
            <Button 
              size="lg" 
              className="gap-3 h-16 px-12 text-xl font-bold shadow-[0_6px_0_0_rgb(194,65,12)] hover:shadow-[0_4px_0_0_rgb(194,65,12)] active:shadow-[0_0px_0_0_rgb(194,65,12)] bg-orange-600 hover:bg-orange-500 active:bg-orange-700 transform hover:-translate-y-0.5 active:translate-y-1 transition-all duration-150 border-0"
            >
              Join the Leaderboard <ArrowRight className="h-7 w-7" />
            </Button>
          </Link>
        )}
        
        {showTotal && (
          <div className={`bg-gradient-to-r ${TOTAL_BG} border ${TOTAL_BORDER} rounded-lg px-5 py-2`}>
            <AnimatedCounter 
              count={stats.totalCount} 
              label="Total Members" 
              icon={TrendingUp} 
              color={TOTAL_COLOR} 
            />
          </div>
        )}
        
        <Link href="/leaderboard">
          <div className={`bg-gradient-to-r ${ECOSYSTEM_BG} border ${ECOSYSTEM_BORDER} rounded-lg px-5 py-2.5 cursor-pointer hover:scale-105 transition-transform`}>
            <AnimatedCounter 
              count={stats.ecosystemCount} 
              label="Ecosystem Partners" 
              icon={Users} 
              color={ECOSYSTEM_COLOR} 
            />
          </div>
        </Link>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className={`bg-gradient-to-r ${ECOSYSTEM_BG} border ${ECOSYSTEM_BORDER} rounded-lg px-4 py-2`}>
            <AnimatedCounter 
              count={stats.ecosystemCount} 
              label="Startups+" 
              icon={Users} 
              color={ECOSYSTEM_COLOR} 
            />
          </div>
          <Link href="/professionals-zone">
            <div className={`bg-gradient-to-r ${PROFESSIONAL_BG} border ${PROFESSIONAL_BORDER} rounded-lg px-4 py-2 cursor-pointer hover:scale-105 transition-transform`}>
              <AnimatedCounter 
                count={stats.professionalCount} 
                label="Professionals" 
                icon={Briefcase} 
                color={PROFESSIONAL_COLOR} 
              />
            </div>
          </Link>
        </div>
        {showTotal && (
          <div className={`bg-gradient-to-r ${TOTAL_BG} border ${TOTAL_BORDER} rounded-lg px-5 py-2`}>
            <AnimatedCounter 
              count={stats.totalCount} 
              label="Total Members" 
              icon={TrendingUp} 
              color={TOTAL_COLOR} 
            />
          </div>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-gradient-to-r from-blue-600/10 via-orange-500/10 to-emerald-500/10 rounded-lg p-4 border ${className}`}>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <AnimatedCounter 
            count={stats.ecosystemCount} 
            label="Ecosystem Partners" 
            icon={Users} 
            color={ECOSYSTEM_COLOR} 
          />
          <AnimatedCounter 
            count={stats.professionalCount} 
            label="Professionals" 
            icon={Briefcase} 
            color={PROFESSIONAL_COLOR} 
          />
          {showTotal && (
            <AnimatedCounter 
              count={stats.totalCount} 
              label="Total Members" 
              icon={TrendingUp} 
              color={TOTAL_COLOR} 
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-6 flex-wrap py-2 ${className}`}>
      <AnimatedCounter 
        count={stats.ecosystemCount} 
        label="Ecosystem Partners" 
        icon={Users} 
        color={ECOSYSTEM_COLOR} 
      />
      <AnimatedCounter 
        count={stats.professionalCount} 
        label="Professionals" 
        icon={Briefcase} 
        color={PROFESSIONAL_COLOR} 
      />
      {showTotal && (
        <AnimatedCounter 
          count={stats.totalCount} 
          label="Total Members" 
          icon={TrendingUp} 
          color={TOTAL_COLOR} 
        />
      )}
    </div>
  );
}
