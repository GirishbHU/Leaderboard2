import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Network, 
  Award, 
  BookOpen,
  CheckCircle2,
  Sparkles,
  Gift,
  Info,
  DollarSign,
  Percent
} from "lucide-react";

interface BenefitItem {
  name: string;
  min: number;
  max: number;
  value: number;
  icon: React.ReactNode;
  isSubjective?: boolean;
}

export function ValueCalculator() {
  const [benefits, setBenefits] = useState<BenefitItem[]>([
    { name: "Professional Assessment", min: 5000, max: 30000, value: 5000, icon: <Target className="h-5 w-5" /> },
    { name: "Multi-Method Valuation", min: 8000, max: 60000, value: 8000, icon: <TrendingUp className="h-5 w-5" /> },
  ]);

  const [additionalBenefits] = useState([
    { name: "Global Network Access", icon: <Network className="h-5 w-5" /> },
    { name: "Recognition & Credibility", icon: <Award className="h-5 w-5" /> },
    { name: "Educational Resources", icon: <BookOpen className="h-5 w-5" /> },
  ]);

  const platformCost = 99;
  const totalTraditionalCost = benefits.reduce((sum, b) => sum + b.value, 0);
  const totalSavings = totalTraditionalCost - platformCost;
  const savingsPercentage = ((totalSavings / totalTraditionalCost) * 100).toFixed(2);
  const valueMultiplier = Math.round(totalTraditionalCost / platformCost);

  const updateBenefitValue = (index: number, newValue: number) => {
    setBenefits(prev => prev.map((b, i) => i === index ? { ...b, value: newValue } : b));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const subscriptionTiers = [
    { inr: "₹1,00,000", usd: "$1,500", period: "Year" },
    { inr: "₹60,000", usd: "$900", period: "Year" },
    { inr: "₹36,000", usd: "$540", period: "Year" },
    { inr: "₹24,000", usd: "$360", period: "Year" },
    { inr: "₹16,000", usd: "$240", period: "Year" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-4 px-4 py-1">
          <Calculator className="h-4 w-4 mr-2" />
          Interactive Value Calculator
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Calculate Your <span className="text-primary">Potential Savings</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter your own estimates to see the real value you can derive from our platform
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                Your Guestimate
              </CardTitle>
              <p className="text-slate-400 text-sm">Adjust sliders based on market rates you know</p>
            </CardHeader>
            <CardContent className="relative z-10 space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        {benefit.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{benefit.name}</p>
                        <p className="text-xs text-slate-400">
                          Range: {formatCurrency(benefit.min)} - {formatCurrency(benefit.max)}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      key={benefit.value}
                      initial={{ scale: 1.2, color: "#10b981" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      className="text-xl font-bold text-white"
                    >
                      {formatCurrency(benefit.value)}
                    </motion.div>
                  </div>
                  <div className="relative">
                    <Slider
                      value={[benefit.value]}
                      min={benefit.min}
                      max={benefit.max}
                      step={1000}
                      onValueChange={(val) => updateBenefitValue(index, val[0])}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between mt-1 text-xs text-slate-500">
                      <span>Min: {formatCurrency(benefit.min)}</span>
                      <span>Max: {formatCurrency(benefit.max)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="pt-6 border-t border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-medium">Additional Benefits</span>
                  <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-300">Subjective</Badge>
                </div>
                <div className="grid gap-3">
                  {additionalBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                    >
                      <div className="text-purple-400">{benefit.icon}</div>
                      <span className="text-slate-300">{benefit.name}</span>
                      <CheckCircle2 className="h-4 w-4 text-purple-400 ml-auto" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Cost Breakdown Results
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="rounded-xl overflow-hidden border border-slate-700/50">
                <div className="grid grid-cols-4 bg-gradient-to-r from-amber-600/30 to-orange-600/30 p-3 text-sm font-medium text-white">
                  <div>Service</div>
                  <div className="text-center">Traditional Cost</div>
                  <div className="text-center">Our Platform</div>
                  <div className="text-center">Savings</div>
                </div>
                
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-4 p-3 border-b border-slate-700/30 text-sm"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <div className="text-amber-400">{benefit.icon}</div>
                      <span className="truncate">{benefit.name}</span>
                    </div>
                    <div className="text-center text-white font-medium">
                      {formatCurrency(benefit.value)}
                    </div>
                    <div className="text-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto" />
                    </div>
                    <motion.div
                      key={benefit.value}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-center text-emerald-400 font-bold"
                    >
                      {formatCurrency(benefit.value)}
                    </motion.div>
                  </motion.div>
                ))}

                <div className="grid grid-cols-4 p-4 bg-gradient-to-r from-emerald-600/30 to-teal-600/30">
                  <div className="font-bold text-white">TOTAL</div>
                  <motion.div
                    key={totalTraditionalCost}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-center font-bold text-white"
                  >
                    {formatCurrency(totalTraditionalCost)}
                  </motion.div>
                  <div className="text-center font-bold text-amber-400">
                    ${platformCost}
                  </div>
                  <motion.div
                    key={totalSavings}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-center font-bold text-emerald-400"
                  >
                    {formatCurrency(totalSavings)}
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <motion.div
                  key={savingsPercentage}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-1">
                    <Percent className="h-4 w-4" />
                    Savings Percentage
                  </div>
                  <motion.p
                    key={savingsPercentage}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-emerald-400"
                  >
                    {savingsPercentage}%
                  </motion.p>
                </motion.div>
                <motion.div
                  key={valueMultiplier}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-1">
                    <TrendingUp className="h-4 w-4" />
                    Value Multiplier
                  </div>
                  <motion.p
                    key={valueMultiplier}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-purple-400"
                  >
                    {valueMultiplier}X
                  </motion.p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10" />
            <CardContent className="relative z-10 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">
                  <span className="text-blue-400 font-medium">Disclaimer:</span> All values displayed are indicative and based on market research. They are intended to help you understand the potential value you can derive from our platform and should not be construed as a guarantee from i2u.ai.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Card className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10" />
          <CardHeader className="relative z-10 text-center">
            <CardTitle className="text-white text-2xl">Upcoming Annual Subscription Plans</CardTitle>
            <p className="text-slate-400">Premium features available after the 60+ day contest period</p>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {subscriptionTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 text-center hover:border-violet-400/50 transition-colors"
                >
                  <p className="text-lg font-bold text-white">{tier.inr}</p>
                  <p className="text-sm text-violet-300">{tier.usd}/{tier.period}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-amber-400" />
                  <span className="font-medium text-white">Contest Offer</span>
                </div>
                <p className="text-sm text-slate-300">
                  Assessment worth <span className="text-amber-400 font-bold">$99</span> is FREE for the first 1,000 registrants or registrations done until 25th December 2025 23:59 IST, whichever is earlier.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Assessment services will be available only after 15th January 2026.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  <span className="font-medium text-white">Referral Bonus</span>
                </div>
                <p className="text-sm text-slate-300">
                  Earn <span className="text-emerald-400 font-bold">20%</span> bonus on every successful referral registration. Share with your network and grow together!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function ValueCalculatorPopup() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20">
          <Calculator className="h-4 w-4" />
          Value Calculator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 bg-slate-950 border-slate-700">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-400" />
            Value Calculator
          </DialogTitle>
          <p className="text-slate-400">See the potential value you can derive from our platform</p>
        </DialogHeader>
        <div className="p-6">
          <ValueCalculatorContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ValueCalculatorContent() {
  const [benefits, setBenefits] = useState<BenefitItem[]>([
    { name: "Professional Assessment", min: 5000, max: 30000, value: 5000, icon: <Target className="h-5 w-5" /> },
    { name: "Multi-Method Valuation", min: 8000, max: 60000, value: 8000, icon: <TrendingUp className="h-5 w-5" /> },
  ]);

  const [additionalBenefits] = useState([
    { name: "Global Network Access", icon: <Network className="h-5 w-5" /> },
    { name: "Recognition & Credibility", icon: <Award className="h-5 w-5" /> },
    { name: "Educational Resources", icon: <BookOpen className="h-5 w-5" /> },
  ]);

  const platformCost = 99;
  const totalTraditionalCost = benefits.reduce((sum, b) => sum + b.value, 0);
  const totalSavings = totalTraditionalCost - platformCost;
  const savingsPercentage = ((totalSavings / totalTraditionalCost) * 100).toFixed(2);
  const valueMultiplier = Math.round(totalTraditionalCost / platformCost);

  const updateBenefitValue = (index: number, newValue: number) => {
    setBenefits(prev => prev.map((b, i) => i === index ? { ...b, value: newValue } : b));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Your Guestimate
          </CardTitle>
          <p className="text-slate-400 text-sm">Adjust sliders based on market rates you know</p>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          {benefits.map((benefit, index) => (
            <div key={benefit.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="font-medium text-white">{benefit.name}</p>
                    <p className="text-xs text-slate-400">
                      Range: {formatCurrency(benefit.min)} - {formatCurrency(benefit.max)}
                    </p>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(benefit.value)}
                </div>
              </div>
              <Slider
                value={[benefit.value]}
                min={benefit.min}
                max={benefit.max}
                step={1000}
                onValueChange={(val) => updateBenefitValue(index, val[0])}
                className="cursor-pointer"
              />
            </div>
          ))}

          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5 text-purple-400" />
              <span className="text-white font-medium">Additional Benefits</span>
              <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-300">Subjective</Badge>
            </div>
            <div className="grid gap-2">
              {additionalBenefits.map((benefit) => (
                <div key={benefit.name} className="flex items-center gap-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-purple-400">{benefit.icon}</div>
                  <span className="text-slate-300 text-sm">{benefit.name}</span>
                  <CheckCircle2 className="h-4 w-4 text-purple-400 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Your Potential Value
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <div className="text-center p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <p className="text-sm text-slate-400 mb-1">Total Traditional Cost</p>
            <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totalTraditionalCost)}</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <p className="text-sm text-slate-400 mb-1">Your Savings</p>
            <p className="text-3xl font-bold text-amber-400">{formatCurrency(totalSavings)}</p>
            <p className="text-sm text-slate-400 mt-1">({savingsPercentage}% savings)</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
            <p className="text-sm text-slate-400 mb-1">Value Multiplier</p>
            <p className="text-3xl font-bold text-violet-400">{valueMultiplier}x</p>
            <p className="text-sm text-slate-400 mt-1">Return on your investment</p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4 text-emerald-400" />
              <span className="font-medium text-white text-sm">Referral Bonus</span>
            </div>
            <p className="text-xs text-slate-300">
              Earn <span className="text-emerald-400 font-bold">20%</span> bonus on every successful referral!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
