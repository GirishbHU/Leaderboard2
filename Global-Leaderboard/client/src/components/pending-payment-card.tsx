import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CreditCard, 
  Gift, 
  Clock, 
  IndianRupee, 
  DollarSign,
  Building2,
  Smartphone,
  Copy,
  CheckCircle,
  XCircle,
  Timer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingPaymentStatus {
  hasPendingPayment: boolean;
  awaitingInr: boolean;
  awaitingUsd: boolean;
  glitchFlaggedAt: string | null;
  glitchResolved: boolean;
  delayHours: number;
  delayDays: number;
  bonusPercent: number;
  amounts: { INR: number; USD: number };
  currency: string;
  registrationFee: number | null;
  registrationFeeCurrency: string | null;
}

interface BankDetails {
  inr: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  usd: {
    bankName: string;
    accountName: string;
    swift: string;
    routingNumber: string;
    accountNumber: string;
  };
  note: string;
}

function CountdownTimer({ flaggedAt }: { flaggedAt: string }) {
  const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const flaggedTime = new Date(flaggedAt).getTime();
    
    const updateTimer = () => {
      const now = Date.now();
      const diff = now - flaggedTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setElapsed({ hours, minutes, seconds });
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [flaggedAt]);
  
  return (
    <div className="flex items-center gap-2 text-sm font-mono bg-destructive/10 text-destructive px-3 py-2 rounded-lg">
      <Timer className="h-4 w-4" />
      <span>Delay: {elapsed.hours}h {elapsed.minutes}m {elapsed.seconds}s</span>
    </div>
  );
}

export function PendingPaymentCard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const { data: paymentStatus, isLoading } = useQuery<PendingPaymentStatus>({
    queryKey: ["/api/payment/pending-status"],
    queryFn: async () => {
      const res = await fetch("/api/payment/pending-status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch payment status");
      return res.json();
    },
  });

  const { data: bankDetails } = useQuery<BankDetails>({
    queryKey: ["/api/payment/bank-details"],
    queryFn: async () => {
      const res = await fetch("/api/payment/bank-details");
      return res.json();
    },
    enabled: showBankDetails,
  });

  const flagGlitchMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/payment/flag-glitch", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to flag issue");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Issue Flagged",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payment/pending-status"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to flag payment issue",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (isLoading) {
    return (
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!paymentStatus?.hasPendingPayment) {
    return null;
  }

  const amount = paymentStatus.currency === "INR" ? paymentStatus.amounts.INR : paymentStatus.amounts.USD;
  const currencySymbol = paymentStatus.currency === "INR" ? "₹" : "$";
  const hasGlitch = paymentStatus.glitchFlaggedAt && !paymentStatus.glitchResolved;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="border-warning border-2 bg-gradient-to-br from-warning/10 to-background">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-warning/20">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <CardTitle className="text-warning">Complete Your Payment</CardTitle>
                <CardDescription>
                  Your account is active but payment is pending
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-warning text-warning">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {hasGlitch && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">Bonus Earned!</span>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  +{paymentStatus.bonusPercent}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Thank you for your patience. You'll receive {paymentStatus.bonusPercent}% bonus 
                ({currencySymbol}{(amount * paymentStatus.bonusPercent / 100).toFixed(2)}) 
                when you complete your payment.
              </p>
              <div className="text-xs space-y-1 mt-2">
                <p className="text-muted-foreground">
                  <span className="font-medium">Delay compensation:</span> +20% per 24 hours
                </p>
                <p className={paymentStatus.delayHours < 24 ? "text-green-600 font-medium" : "text-amber-600"}>
                  <span className="font-medium">Genuine Efforts Bonus:</span> {Math.max(0, 30 - (paymentStatus.delayDays * 5))}% 
                  {paymentStatus.delayHours < 24 ? " (pay now to keep full 30%!)" : " (reduces 5% every 24 hours)"}
                </p>
              </div>
              <CountdownTimer flaggedAt={paymentStatus.glitchFlaggedAt!} />
            </div>
          )}

          <div className="flex items-center justify-center gap-2 py-4">
            <span className="text-4xl font-bold text-primary">
              {currencySymbol}{amount.toLocaleString()}
            </span>
            <span className="text-muted-foreground">/year</span>
          </div>

          <Tabs defaultValue="online" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="online">
                <CreditCard className="h-4 w-4 mr-2" />
                Online
              </TabsTrigger>
              <TabsTrigger value="upi">
                <Smartphone className="h-4 w-4 mr-2" />
                UPI
              </TabsTrigger>
              <TabsTrigger value="bank">
                <Building2 className="h-4 w-4 mr-2" />
                Bank
              </TabsTrigger>
            </TabsList>

            <TabsContent value="online" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-16 flex-col gap-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(`/register?resume=true&provider=paypal`, "_self")}
                >
                  <DollarSign className="h-5 w-5" />
                  <span>PayPal (USD)</span>
                </Button>
                <Button 
                  className="h-16 flex-col gap-1 bg-orange-600 hover:bg-orange-700"
                  onClick={() => window.open(`/register?resume=true&provider=cashfree`, "_self")}
                >
                  <IndianRupee className="h-5 w-5" />
                  <span>Cashfree (INR)</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upi" className="space-y-3 mt-4">
              {bankDetails?.inr?.upiId ? (
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">UPI ID</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(bankDetails.inr.upiId, "UPI ID")}
                    >
                      {copied === "UPI ID" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="font-mono text-lg font-bold text-center py-2 bg-background rounded">
                    {bankDetails.inr.upiId}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Scan or enter this UPI ID in any UPI app to pay
                  </p>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowBankDetails(true)}
                >
                  Load UPI Details
                </Button>
              )}
            </TabsContent>

            <TabsContent value="bank" className="space-y-3 mt-4">
              {bankDetails ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" /> INR Account
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Bank:</span>
                      <span>{bankDetails.inr.bankName}</span>
                      <span className="text-muted-foreground">Account:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono">{bankDetails.inr.accountNumber}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(bankDetails.inr.accountNumber, "Account")}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-muted-foreground">IFSC:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono">{bankDetails.inr.ifscCode}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(bankDetails.inr.ifscCode, "IFSC")}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> USD Account
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Bank:</span>
                      <span>{bankDetails.usd.bankName}</span>
                      <span className="text-muted-foreground">SWIFT:</span>
                      <span className="font-mono">{bankDetails.usd.swift}</span>
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-mono">{bankDetails.usd.accountNumber}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    {bankDetails.note}
                  </p>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowBankDetails(true)}
                >
                  Load Bank Details
                </Button>
              )}
            </TabsContent>
          </Tabs>

          {!hasGlitch && (
            <div className="pt-4 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => flagGlitchMutation.mutate()}
                disabled={flagGlitchMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {flagGlitchMutation.isPending ? "Flagging..." : "Report Payment Issue"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Having trouble paying? Flag the issue to earn bonus credits.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
