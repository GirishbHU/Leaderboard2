import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Cashfree: any;
  }
}

interface CashfreeButtonProps {
  amount: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess?: (orderId: string, paymentDetails: any) => void;
  onFailure?: (error: string) => void;
  className?: string;
}

export function CashfreeButton({
  amount,
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
  className = "",
}: CashfreeButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [environment, setEnvironment] = useState<string>("sandbox");

  useEffect(() => {
    fetch("/api/cashfree/config")
      .then((res) => res.json())
      .then((data) => {
        setConfigured(data.configured);
        setEnvironment(data.environment);
      })
      .catch(() => setConfigured(false));

    if (!document.getElementById("cashfree-sdk")) {
      const script = document.createElement("script");
      script.id = "cashfree-sdk";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => setSdkLoaded(true);
      document.head.appendChild(script);
    } else {
      setSdkLoaded(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!sdkLoaded) {
      toast({
        title: "Loading...",
        description: "Payment system is loading. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const orderResponse = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerId,
          customerName,
          customerEmail,
          customerPhone,
          returnUrl: `${window.location.origin}/payment/callback`,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const cashfree = window.Cashfree({
        mode: environment === "production" ? "production" : "sandbox",
      });

      const checkoutOptions = {
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          console.error("Payment error:", result.error);
          onFailure?.(result.error.message || "Payment failed");
          toast({
            title: "Payment Failed",
            description: result.error.message || "Something went wrong",
            variant: "destructive",
          });
        } else if (result.redirect) {
          console.log("Redirecting to payment page...");
        } else if (result.paymentDetails) {
          verifyPayment(orderData.orderId);
        }
        setLoading(false);
      });
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      setLoading(false);
      onFailure?.(error.message);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };

  const verifyPayment = async (orderId: string) => {
    try {
      const response = await fetch(`/api/cashfree/verify/${orderId}`);
      const data = await response.json();

      if (data.success) {
        onSuccess?.(orderId, data.paymentDetails);
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
        });
      } else {
        onFailure?.(data.status || "Payment verification failed");
        toast({
          title: "Payment Status: " + data.status,
          description: "Please check your payment status.",
          variant: data.status === "PENDING" ? "default" : "destructive",
        });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      onFailure?.("Failed to verify payment");
    }
  };

  if (configured === false) {
    return (
      <Button disabled className={className} variant="outline">
        <AlertCircle className="mr-2 h-4 w-4" />
        INR Payment Not Available
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !sdkLoaded || configured === null}
      className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white ${className}`}
      data-testid="button-cashfree-pay"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay ₹{amount.toLocaleString("en-IN")}
        </>
      )}
    </Button>
  );
}
