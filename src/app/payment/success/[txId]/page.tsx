// app/payment/success/[txId]/page.tsx
//PAYMENT
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface VerificationData {
  success: boolean;
  message: string;
  data: {
    order: {
      id: string;
      status: string;
      amount: number;
      plan: string;
    };
    payment: {
      id: string;
      status: string;
    };
  };
}

export default function PaymentSuccess({
  params,
}: {
  params: Promise<{ txId: string }>;
}) {
  const router = useRouter();
  const [txId, setTxId] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function unwrapParams() {
      const unwrappedParams = await params;
      setTxId(unwrappedParams.txId);
    }
    unwrapParams();
  }, [params]);
  useEffect(() => {
    if (!txId) return;

    const verifyPayment = async () => {
      try {
        setLoading(true);
        console.log("Verifying payment with txId:", txId);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/verify?tx_ref=${txId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            signal: AbortSignal.timeout(10000), // 10 second timeout
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: VerificationData = await response.json();
        console.log("Verification data:", data);

        if (data.success) {
          setVerification(data);
          toast.success("Payment verified successfully!");
        } else {
          setError(data.message || "Payment verification failed");
          toast.error("Payment verification failed");
        }
      } catch (err: any) {
        console.error("Fetch error details:", err);

        if (err.name === "AbortError") {
          setError("Verification timeout. Please try again.");
          toast.error("Verification timeout");
        } else if (err.name === "TypeError") {
          setError(
            "Cannot connect to server. Please check if the backend is running."
          );
          toast.error("Connection error");
        } else {
          setError(
            err.message || "Failed to verify payment. Please try again."
          );
          toast.error("Verification failed");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [txId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Verifying Payment
                </h2>
                <p className="text-muted-foreground">
                  Please wait while we confirm your payment details...
                </p>
                {txId && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    TX: {txId.slice(0, 8)}...
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-destructive">
                  Verification Error
                </h2>
                <p className="text-muted-foreground">{error}</p>
                {txId && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    TX: {txId.slice(0, 8)}...
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Retry Verification
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="flex-1"
                >
                  Go to Projects
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-4">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
                Payment Successful!
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your payment. Your plan has been upgraded
                successfully.
              </p>
            </div>

            {/* Payment Details */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="font-mono text-xs truncate">{txId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">
                      Order ID
                    </p>
                    <p>{verification?.data.order.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Plan</p>
                    <Badge variant="secondary" className="capitalize">
                      {verification?.data.order.plan}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Amount</p>
                    <p className="font-semibold">
                      {verification?.data.order.amount} ETB
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    {verification?.data.order.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You can now create projects according to your new plan limits.
              </p>
              <p className="text-xs text-muted-foreground">
                A confirmation email has been sent to your registered email
                address.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
