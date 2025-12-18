import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Wallet, Gift, DollarSign, IndianRupee } from "lucide-react";

const DEFAULT_EXCHANGE_RATE = 84;
const REFERRAL_BONUS_PERCENT = 20;

interface PriceTier {
  label: string;
  inr: number;
  usd: number;
}

const ECOSYSTEM_TIERS: PriceTier[] = [
  { label: "₹999 / $14.99", inr: 999, usd: 14.99 },
  { label: "₹1,999 / $29.99", inr: 1999, usd: 29.99 },
  { label: "₹4,999 / $74.99", inr: 4999, usd: 74.99 },
  { label: "₹7,999 / $119.99", inr: 7999, usd: 119.99 },
  { label: "₹8,999 / $134.99", inr: 8999, usd: 134.99 },
  { label: "₹9,999 / $149.99", inr: 9999, usd: 149.99 },
];

const PROFESSIONAL_TIERS: PriceTier[] = [
  { label: "₹99 / $1.49", inr: 99, usd: 1.49 },
  { label: "₹199 / $2.99", inr: 199, usd: 2.99 },
  { label: "₹499 / $7.49", inr: 499, usd: 7.49 },
  { label: "₹799 / $11.99", inr: 799, usd: 11.99 },
  { label: "₹899 / $13.49", inr: 899, usd: 13.49 },
  { label: "₹999 / $14.99", inr: 999, usd: 14.99 },
];

interface TierInput {
  countINR: number;
  countUSD: number;
}

export function ReferralCalculator() {
  const [open, setOpen] = useState(false);
  const [stakeholderType, setStakeholderType] = useState<"ecosystem" | "professional">("ecosystem");
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_EXCHANGE_RATE);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [rateSource, setRateSource] = useState("ECB");
  
  const tiers = stakeholderType === "ecosystem" ? ECOSYSTEM_TIERS : PROFESSIONAL_TIERS;
  
  const [tierInputs, setTierInputs] = useState<TierInput[]>(
    tiers.map(() => ({ countINR: 0, countUSD: 0 }))
  );

  useEffect(() => {
    if (open) {
      fetch("/api/exchange-rate")
        .then(res => res.json())
        .then(data => {
          if (data.rate) {
            setExchangeRate(data.rate);
            setRateDate(data.date);
            setRateSource(data.source || "ECB");
          }
        })
        .catch(() => {
          setExchangeRate(DEFAULT_EXCHANGE_RATE);
        });
    }
  }, [open]);

  const updateTierInput = (index: number, field: keyof TierInput, value: number) => {
    setTierInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = { ...newInputs[index], [field]: Math.max(0, value) };
      return newInputs;
    });
  };

  const calculations = useMemo(() => {
    let totalINR = 0;
    let totalUSD = 0;
    let totalReferrals = 0;

    tierInputs.forEach((input, index) => {
      const tier = tiers[index];
      if (tier) {
        totalINR += input.countINR * tier.inr * (REFERRAL_BONUS_PERCENT / 100);
        totalUSD += input.countUSD * tier.usd * (REFERRAL_BONUS_PERCENT / 100);
        totalReferrals += input.countINR + input.countUSD;
      }
    });

    const combinedINR = totalINR + (totalUSD * exchangeRate);
    const combinedUSD = totalUSD + (totalINR / exchangeRate);

    return {
      totalINR,
      totalUSD,
      totalReferrals,
      combinedINR,
      combinedUSD,
    };
  }, [tierInputs, tiers, exchangeRate]);

  const handleStakeholderChange = (type: "ecosystem" | "professional") => {
    setStakeholderType(type);
    const newTiers = type === "ecosystem" ? ECOSYSTEM_TIERS : PROFESSIONAL_TIERS;
    setTierInputs(newTiers.map(() => ({ countINR: 0, countUSD: 0 })));
  };

  const presetScenarios = [
    { name: "5 Referrals", count: 5 },
    { name: "10 Referrals", count: 10 },
    { name: "25 Referrals", count: 25 },
    { name: "50 Referrals", count: 50 },
    { name: "100 Referrals", count: 100 },
  ];

  const applyPreset = (count: number) => {
    const distribution = tiers.map((_, index) => {
      const baseCount = Math.floor(count / tiers.length);
      const remainder = index < (count % tiers.length) ? 1 : 0;
      return {
        countINR: Math.floor((baseCount + remainder) / 2),
        countUSD: Math.ceil((baseCount + remainder) / 2),
      };
    });
    setTierInputs(distribution);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 hover:from-green-500/20 hover:to-blue-500/20 border-green-500/30">
          <Calculator className="h-4 w-4" />
          Referral Earnings Calculator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="h-6 w-6 text-green-500" />
            Referral Bonus Calculator
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (20% commission on each referral)
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={stakeholderType} onValueChange={(v) => handleStakeholderChange(v as "ecosystem" | "professional")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ecosystem" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Ecosystem Partners
            </TabsTrigger>
            <TabsTrigger value="professional" className="gap-2">
              <Wallet className="h-4 w-4" />
              Professionals
            </TabsTrigger>
          </TabsList>

          <TabsContent value={stakeholderType} className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-muted-foreground mr-2">Quick presets:</span>
              {presetScenarios.map((scenario) => (
                <Button
                  key={scenario.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(scenario.count)}
                >
                  {scenario.name}
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Enter Your Referral Mix
                  <span className="text-xs font-normal text-muted-foreground">
                    (Different price levels based on signup timing)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="grid grid-cols-[1fr_100px_100px_140px] gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
                    <div>Price Level</div>
                    <div className="text-center flex items-center justify-center gap-1">
                      <IndianRupee className="h-3 w-3" /> INR Count
                    </div>
                    <div className="text-center flex items-center justify-center gap-1">
                      <DollarSign className="h-3 w-3" /> USD Count
                    </div>
                    <div className="text-right">Earnings</div>
                  </div>
                  
                  {tiers.map((tier, index) => {
                    const input = tierInputs[index];
                    const earningsINR = input.countINR * tier.inr * (REFERRAL_BONUS_PERCENT / 100);
                    const earningsUSD = input.countUSD * tier.usd * (REFERRAL_BONUS_PERCENT / 100);
                    
                    return (
                      <div key={index} className="grid grid-cols-[1fr_100px_100px_140px] gap-2 items-center">
                        <Label className="text-sm">{tier.label}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={input.countINR || ""}
                          onChange={(e) => updateTierInput(index, "countINR", parseInt(e.target.value) || 0)}
                          className="h-8 text-center"
                          placeholder="0"
                        />
                        <Input
                          type="number"
                          min="0"
                          value={input.countUSD || ""}
                          onChange={(e) => updateTierInput(index, "countUSD", parseInt(e.target.value) || 0)}
                          className="h-8 text-center"
                          placeholder="0"
                        />
                        <div className="text-right text-sm">
                          {earningsINR > 0 && <span className="text-green-600">₹{earningsINR.toLocaleString()}</span>}
                          {earningsINR > 0 && earningsUSD > 0 && " + "}
                          {earningsUSD > 0 && <span className="text-blue-600">${earningsUSD.toFixed(2)}</span>}
                          {earningsINR === 0 && earningsUSD === 0 && <span className="text-muted-foreground">-</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-orange-500" />
                    INR Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{calculations.totalINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    From {tierInputs.reduce((sum, t) => sum + t.countINR, 0)} INR referrals
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    USD Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${calculations.totalUSD.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    From {tierInputs.reduce((sum, t) => sum + t.countUSD, 0)} USD referrals
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-green-500" />
                    Combined Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-600">
                    ₹{calculations.combinedINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ${calculations.combinedUSD.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    @ ₹{exchangeRate}/$ ({rateSource}{rateDate ? `, ${rateDate}` : ""}) • {calculations.totalReferrals} total referrals
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-500/5 to-pink-500/5">
              <CardContent className="pt-4">
                <div className="text-sm text-center text-muted-foreground">
                  <p className="mb-2">
                    <strong>How it works:</strong> Earn 20% of every referral's registration fee as bonus!
                  </p>
                  <p>
                    {stakeholderType === "ecosystem" 
                      ? "Ecosystem partners (Startups, Mentors, Enablers, Influencers, Facilitators, Investors) pay ₹999-₹9,999 based on signup timing."
                      : "Professionals (Job Seekers) pay ₹99-₹999 based on signup timing."
                    }
                  </p>
                  <p className="mt-2 font-medium text-primary">
                    Share your referral link and watch your wallet grow!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
