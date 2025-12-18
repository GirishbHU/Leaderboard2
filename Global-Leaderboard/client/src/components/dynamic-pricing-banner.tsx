import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Globe, Award, BookOpen, DollarSign, Clock, TrendingUp, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ValueCalculatorPopup } from "@/components/value-calculator";

// Airport STA-style flip digit component (count UP)
function FlipDigit({ digit, index, isLast, totalDigits, allDigits }: { digit: string; index: number; isLast: boolean; totalDigits: number; allDigits: string[] }) {
  const nextDigit = ((parseInt(digit) + 1) % 10).toString();
  
  // Check if this digit will cascade (all digits to the right are 9)
  const willCascade = digit === "9" && allDigits.slice(index + 1).every(d => d === "9");
  const shouldAnimate = isLast || willCascade;
  
  return (
    <div className="relative w-7 h-10 mx-0.5 overflow-hidden rounded-sm shadow-lg" style={{ perspective: "200px" }}>
      {/* Airport display background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-gray-700" />
      
      {/* Stable centered digit for non-animating digits */}
      {!shouldAnimate && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-yellow-400 font-mono z-20">
          {digit}
        </div>
      )}
      
      {/* Animating digit with wobble and ghost preview */}
      {shouldAnimate && (
        <>
          {/* Ghost of next digit peeking from above */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-yellow-400/25 font-mono z-20"
            animate={{ y: [-14, -12, -14] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: (totalDigits - index - 1) * 0.15 }}
          >
            {nextDigit}
          </motion.div>
          
          {/* Current digit wobbling upward */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-yellow-400 font-mono z-20"
            animate={{ y: [0, -2, 0, -1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: (totalDigits - index - 1) * 0.1 }}
          >
            {digit}
          </motion.div>
          
          {/* Glow effect - brighter for cascade digits */}
          <motion.div
            className="absolute inset-0 rounded-sm z-10"
            animate={{ 
              boxShadow: willCascade && !isLast ? [
                "inset 0 0 10px rgba(251, 146, 60, 0)",
                "inset 0 0 10px rgba(251, 146, 60, 0.5)",
                "inset 0 0 10px rgba(251, 146, 60, 0)"
              ] : [
                "inset 0 0 8px rgba(250, 204, 21, 0)",
                "inset 0 0 8px rgba(250, 204, 21, 0.4)",
                "inset 0 0 8px rgba(250, 204, 21, 0)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: (totalDigits - index - 1) * 0.1 }}
          />
        </>
      )}
      
      {/* Center split line (airport style) */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black shadow-sm z-30" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600 z-30 translate-y-[1px]" />
    </div>
  );
}

// Live rolling counter component
function LiveCounter({ count, isLive = false, size = "normal" }: { count: number; isLive?: boolean; size?: "normal" | "large" }) {
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCount = useRef(count);
  
  useEffect(() => {
    if (count !== prevCount.current) {
      setIsAnimating(true);
      const diff = count - prevCount.current;
      const steps = Math.min(Math.abs(diff), 15);
      const stepDelay = 80;
      
      for (let i = 1; i <= steps; i++) {
        setTimeout(() => {
          setDisplayCount(prevCount.current + Math.round((diff * i) / steps));
        }, stepDelay * i);
      }
      
      setTimeout(() => {
        prevCount.current = count;
        setDisplayCount(count);
        setIsAnimating(false);
      }, stepDelay * steps + 100);
    }
  }, [count]);
  
  const digits = displayCount.toString().split("");
  const isLarge = size === "large";
  
  return (
    <div className="inline-flex items-center">
      <div className={`flex items-center ${isLarge ? "gap-1" : ""}`}>
        {digits.map((digit, index) => (
          isLarge ? (
            <FlipDigit 
              key={`${index}-${digit}`} 
              digit={digit} 
              index={index} 
              isLast={index === digits.length - 1}
              totalDigits={digits.length}
              allDigits={digits}
            />
          ) : (
            <motion.span
              key={`${index}-${digit}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-mono font-bold"
            >
              {digit}
            </motion.span>
          )
        ))}
      </div>
      {isLive && (
        <motion.span
          className={`${isLarge ? "ml-2 w-2.5 h-2.5" : "ml-1 w-2 h-2"} bg-green-400 rounded-full`}
          animate={{ 
            scale: isAnimating ? [1, 1.5, 1] : [1, 1.2, 1], 
            opacity: [1, 0.7, 1],
            boxShadow: isAnimating 
              ? ["0 0 0 0 rgba(74, 222, 128, 0.4)", "0 0 0 8px rgba(74, 222, 128, 0)", "0 0 0 0 rgba(74, 222, 128, 0.4)"]
              : "none"
          }}
          transition={{ duration: isAnimating ? 0.5 : 1.5, repeat: Infinity }}
          title="Live count"
        />
      )}
    </div>
  );
}

// Airport STA-style countdown digit component (count DOWN)
function CountdownDigit({ digit, index, isLast, totalDigits, allDigits }: { digit: string; index: number; isLast: boolean; totalDigits: number; allDigits: string[] }) {
  const prevDigit = ((parseInt(digit) - 1 + 10) % 10).toString();
  
  // Check if this digit will cascade (all digits to the right are 0)
  const willCascade = digit === "0" && allDigits.slice(index + 1).every(d => d === "0");
  const shouldAnimate = isLast || willCascade;
  
  return (
    <div className="relative w-6 h-8 mx-0.5 overflow-hidden rounded-sm shadow-lg" style={{ perspective: "200px" }}>
      {/* Airport display background - red tinted for countdown */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-red-900/50" />
      
      {/* Stable centered digit for non-animating digits */}
      {!shouldAnimate && (
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white font-mono z-20">
          {digit}
        </div>
      )}
      
      {/* Animating digit with wobble down and ghost preview */}
      {shouldAnimate && (
        <>
          {/* Ghost of next (lower) digit peeking from below */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-xl font-bold text-red-400/30 font-mono z-20"
            animate={{ y: [12, 10, 12] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: (totalDigits - index - 1) * 0.15 }}
          >
            {prevDigit}
          </motion.div>
          
          {/* Current digit wobbling downward */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-xl font-bold text-red-400 font-mono z-20"
            animate={{ y: [0, 2, 0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: (totalDigits - index - 1) * 0.1 }}
          >
            {digit}
          </motion.div>
          
          {/* Red glow effect - brighter orange for cascade */}
          <motion.div
            className="absolute inset-0 rounded-sm z-10"
            animate={{ 
              boxShadow: willCascade && !isLast ? [
                "inset 0 0 10px rgba(251, 146, 60, 0)",
                "inset 0 0 10px rgba(251, 146, 60, 0.6)",
                "inset 0 0 10px rgba(251, 146, 60, 0)"
              ] : [
                "inset 0 0 8px rgba(248, 113, 113, 0)",
                "inset 0 0 8px rgba(248, 113, 113, 0.5)",
                "inset 0 0 8px rgba(248, 113, 113, 0)"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity, delay: (totalDigits - index - 1) * 0.1 }}
          />
        </>
      )}
      
      {/* Center split line (airport style) */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black shadow-sm z-30" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600 z-30 translate-y-[1px]" />
    </div>
  );
}

// Animated countdown component
function AnimatedCountdown({ count }: { count: number }) {
  const digits = count.toString().split("");
  
  return (
    <span className="inline-flex items-center">
      {digits.map((digit, index) => (
        <CountdownDigit 
          key={`${index}-${digit}`} 
          digit={digit} 
          index={index}
          isLast={index === digits.length - 1}
          totalDigits={digits.length}
          allDigits={digits}
        />
      ))}
    </span>
  );
}

interface PricingStats {
  signupCount: number;
  currentPriceINR: number;
  currentPriceUSD: number;
  nextPriceINR: number | null;
  nextPriceUSD: number | null;
  spotsRemaining: number;
  nextTierAt: number | null;
  daysUntilNextTier: number;
  estimatedNextTierDate: string | null;
  avgRegistrationsPerDay: number;
  isLastTier: boolean;
}

interface DynamicPricingBannerProps {
  showBenefits?: boolean;
  compact?: boolean;
  className?: string;
  stakeholderType?: "ecosystem" | "professional";
}

export function DynamicPricingBanner({ 
  showBenefits = true, 
  compact = false,
  className = "",
  stakeholderType = "ecosystem"
}: DynamicPricingBannerProps) {
  const [stats, setStats] = useState<PricingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pricing/dynamic-stats?stakeholderType=${stakeholderType}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [stakeholderType]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {showBenefits && (
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 gap-1">
            <DollarSign className="h-3 w-3" />
            $90,000+ Value
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 gap-1">
            <Globe className="h-3 w-3" />
            Global Access
          </Badge>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30 gap-1">
            <Award className="h-3 w-3" />
            Recognition & Credibility
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1">
            <BookOpen className="h-3 w-3" />
            Knowledge & Wisdom
          </Badge>
        </div>
      )}


      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <p className={`font-bold ${compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}`}>
            Upto <span className="text-primary">$90,000+</span> worth of benefits
          </p>
          <ValueCalculatorPopup />
        </div>
        <p className={compact ? "text-lg md:text-xl" : "text-xl md:text-2xl"}>
          for just <span className="text-primary font-bold">₹{stats?.currentPriceINR?.toLocaleString() || "999"}/year</span>{" "}
          <span className="text-muted-foreground">(${stats?.currentPriceUSD || "14.99"}/year)</span>
        </p>
        <p className="text-xs text-muted-foreground">Annual Listing Fee • Premium benefits included FREE as promotion</p>
      </div>

      {stats && !stats.isLastTier && stats.spotsRemaining > 0 && (() => {
        const URGENCY_THRESHOLD = 50;
        const isUrgent = stats.spotsRemaining <= URGENCY_THRESHOLD;
        const priceIncreaseINR = (stats.nextPriceINR || 0) - stats.currentPriceINR;
        const priceIncreaseUSD = ((stats.nextPriceUSD || 0) - stats.currentPriceUSD).toFixed(1);
        
        return (
          <div className={`mt-2 p-4 text-white rounded-lg shadow-lg ${
              stakeholderType === "professional"
                ? (isUrgent ? "bg-gradient-to-r from-orange-600 to-red-500 animate-pulse" : "bg-gradient-to-r from-orange-500 to-red-400")
                : (isUrgent ? "bg-gradient-to-r from-blue-600 to-slate-500 animate-pulse" : "bg-gradient-to-r from-blue-500 to-slate-400")
            }`}>
            {isUrgent ? (
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-base font-bold flex items-center gap-1">
                  Hurry! Only <AnimatedCountdown count={stats.spotsRemaining} /> spots left at this price!
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-bold">Price increases after {stats.spotsRemaining} more registrations!</span>
              </div>
            )}
            
            {isUrgent ? (
              <p className="text-lg font-bold text-center">
                Register now before price goes up by ₹{priceIncreaseINR.toLocaleString()} (${priceIncreaseUSD})/year!
              </p>
            ) : (
              <p className="text-lg font-bold text-center">
                ₹{stats.currentPriceINR.toLocaleString()}/year → ₹{stats.nextPriceINR?.toLocaleString()}/year{" "}
                (${stats.currentPriceUSD} → ${stats.nextPriceUSD})
              </p>
            )}
            
            <div className="flex flex-col items-center gap-1 mt-2">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((stats.nextTierAt! - stats.spotsRemaining) / stats.nextTierAt!) * 100)}%` }}
                />
              </div>
              <div className="flex flex-col items-center gap-2 text-xs opacity-90">
                <div className="flex items-center gap-2">
                  <LiveCounter count={stats.signupCount} isLive={true} size="large" />
                  <span className="text-sm font-medium">registered</span>
                </div>
                {/* Only show estimated date if within 24 hours */}
                {stats.daysUntilNextTier && stats.daysUntilNextTier <= 1 && stats.estimatedNextTierDate && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Est. price change by {formatDate(stats.estimatedNextTierDate)}</span>
                  </div>
                )}
              </div>
              {/* Urgency message when deadline > 24 hours */}
              {stats.daysUntilNextTier && stats.daysUntilNextTier > 1 && (
                <div className="mt-1 flex items-center gap-1 text-xs font-bold animate-pulse">
                  <Sparkles className="h-3 w-3" />
                  <span>Hurry! Spots are filling fast!</span>
                </div>
              )}
            </div>
            <p className="text-xs mt-2 text-center opacity-90 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" />
              {isUrgent ? "Don't miss out - secure your spot today!" : "Lock in the lowest price now!"}
            </p>
          </div>
        );
      })()}

      {stats?.isLastTier && (
        <div className="mt-2 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg">
          <p className="text-sm font-bold text-center">You're getting the best available rate!</p>
          <p className="text-xs mt-1 text-center opacity-90">{stats.signupCount} ecosystem partners already registered</p>
        </div>
      )}
    </div>
  );
}

interface DynamicStatsBarProps {
  stakeholderType?: "ecosystem" | "professional";
}

export function DynamicStatsBar({ stakeholderType = "ecosystem" }: DynamicStatsBarProps) {
  const [stats, setStats] = useState<PricingStats | null>(null);

  useEffect(() => {
    fetch(`/api/pricing/dynamic-stats?stakeholderType=${stakeholderType}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(() => {});
  }, [stakeholderType]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/20">
      <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-primary">$90K+</p>
        <p className="text-sm text-muted-foreground">Worth of benefits</p>
      </div>
      <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-primary">98</p>
        <p className="text-sm text-muted-foreground">Point multi-layered evaluation</p>
      </div>
      <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-primary">35%+</p>
        <p className="text-sm text-muted-foreground">Improvement in assessments</p>
      </div>
      <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-primary">
          {stats?.spotsRemaining || 60}+
        </p>
        <p className="text-sm text-muted-foreground">Spots left at current price</p>
      </div>
    </div>
  );
}
