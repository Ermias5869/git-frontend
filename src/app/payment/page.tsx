// app/payment-test/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface PaymentResponse {
  success: boolean;
  tx_ref: string;
  checkout_url: string;
  orderId: number;
  message?: string;
  error?: string;
}

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(
    null
  );
  const [formData, setFormData] = useState({
    firstName: "Ermias",
    lastName: "Amare",
    email: "amareermias42@gmail.com",
    amount: "100",
    userId: "cmh6bkkwf0000ljxodjx3qbwo",
    plan: "Pro" as "Basic" | "Pro" | "Enterprise" | "Free",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentResult(null);

    try {
      console.log("💰 Sending payment request:", formData);

      const response = await fetch(
        "http://localhost:3001/api/payment/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      console.log("📡 Payment response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Payment response:", result);

      if (result.success) {
        setPaymentResult(result);
        toast.success("Payment initialized successfully!");

        // Redirect to Chapa checkout page
        if (result.checkout_url) {
          window.location.href = result.checkout_url;
        }
      } else {
        toast.error(result.error || "Payment initialization failed");
      }
    } catch (error: any) {
      console.error("❌ Payment error:", error);
      toast.error(error.message || "Failed to initialize payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!paymentResult?.tx_ref) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/payment/verify/${paymentResult.tx_ref}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log("🔍 Verification response:", result);

      if (result.success) {
        toast.success("Payment verified successfully!");
      } else {
        toast.error(result.message || "Payment verification failed");
      }
    } catch (error: any) {
      console.error("❌ Verification error:", error);
      toast.error("Failed to verify payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetOrder = async () => {
    if (!paymentResult?.tx_ref) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/payment/order/${paymentResult.tx_ref}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log("📦 Order details:", result);

      if (result.success) {
        toast.success("Order details fetched!");
      } else {
        toast.error(result.message || "Failed to fetch order details");
      }
    } catch (error: any) {
      console.error("❌ Order fetch error:", error);
      toast.error("Failed to fetch order details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Payment Form Card */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Payment Test</CardTitle>
            <CardDescription className="text-center">
              Test your Chapa payment integration with the backend API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (ETB)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    required
                    min="1"
                  />
                </div>

                {/* Plan */}
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Select
                    value={formData.plan}
                    onValueChange={(
                      value: "Basic" | "Pro" | "Enterprise" | "Free"
                    ) => handleInputChange("plan", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Initialize Payment"}
              </Button>
            </form>

            {/* Debug Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Debug Information</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
              <p className="text-xs text-gray-600 mt-2">
                Endpoint: POST http://localhost:3001/api/payment/initialize
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Results Card */}
        {paymentResult && (
          <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Payment Results</CardTitle>
              <CardDescription>
                Payment initialization response and actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(paymentResult, null, 2)}
                </pre>
              </div>

              <div className="flex gap-3 flex-wrap">
                {paymentResult.checkout_url && (
                  <Button
                    onClick={() =>
                      (window.location.href = paymentResult.checkout_url)
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Checkout
                  </Button>
                )}

                <Button
                  onClick={handleVerifyPayment}
                  disabled={isLoading}
                  variant="outline"
                >
                  Verify Payment
                </Button>

                <Button
                  onClick={handleGetOrder}
                  disabled={isLoading}
                  variant="outline"
                >
                  Get Order Details
                </Button>

                <Button
                  onClick={() => {
                    if (paymentResult.tx_ref) {
                      window.open(
                        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/success/${paymentResult.tx_ref}`,
                        "_blank"
                      );
                    }
                  }}
                  variant="outline"
                >
                  View Success Page
                </Button>
              </div>

              {/* Transaction Reference Info */}
              {paymentResult.tx_ref && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">
                    Transaction Reference:
                  </p>
                  <p className="text-sm text-green-600 font-mono break-all">
                    {paymentResult.tx_ref}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test Data Card */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Test Data</CardTitle>
            <CardDescription>
              Sample data for testing different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      amount: "50",
                      plan: "Basic",
                    })
                  }
                >
                  Basic Plan (50 ETB)
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      amount: "100",
                      plan: "Pro",
                    })
                  }
                >
                  Pro Plan (100 ETB)
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      amount: "200",
                      plan: "Enterprise",
                    })
                  }
                >
                  Enterprise Plan (200 ETB)
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      amount: "0",
                      plan: "Free",
                    })
                  }
                >
                  Free Plan (0 ETB)
                </Button>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Make sure your backend is running on
                  port 3001 and Chapa API keys are properly configured. The
                  currency is ETB (Ethiopian Birr).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
