// app/pricing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Zap,
  Crown,
  Sparkles,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/stores/auth-store";
import { RedirectManager } from "@/lib/redirect";
import Link from "next/link";

// Zod schema for payment validation
const paymentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  maxProjects: number;
  maxCommitsPerProject: number;
  maxFileSizeMB: number;
  description: string;
}

interface UserSubscription {
  currentPlan: string;
  previousPlan: string | null;
  subscriptionStatus: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isActive: boolean;
  daysRemaining: number;
}

// API base URL - adjust this based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      RedirectManager.setRedirectPath("/pricing");
      setShouldRedirect(true);
      router.push("/login?redirect=/pricing");
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      firstName: user?.username?.split(" ")[0] || "",
      lastName: user?.username?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      const nameParts = user.username.split(" ");
      setValue("firstName", nameParts[0] || "");
      setValue("lastName", nameParts.slice(1).join(" ") || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  useEffect(() => {
    fetchPlans();
    fetchUserSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      console.log("Fetching plans from:", `${API_BASE_URL}/payment/plans`);

      const response = await fetch(`${API_BASE_URL}/payment/plans`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Plans response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Plans response data:", result);

      if (result.success) {
        setPlans(result.data);
      } else {
        toast.error(result.message || "Failed to load plans");
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error(
        "Failed to load pricing plans. Please check if the backend server is running."
      );

      // Fallback to default plans if API fails
      setPlans([
        {
          id: "free",
          name: "Free",
          price: 0,
          currency: "ETB",
          description: "Perfect for getting started",
          features: [
            "1 project per month",
            "Up to 10 commits per project",
            "5MB file upload limit",

            "Standard processing",
          ],
          maxProjects: 1,
          maxCommitsPerProject: 10,
          maxFileSizeMB: 5,
        },
        {
          id: "pro",
          name: "Pro",
          price: 100,
          currency: "ETB",
          description: "For serious developers",
          features: [
            "5 projects per month",
            "Up to 50 commits per project",
            "20MB file upload limit",

            "Priority processing",
          ],
          maxProjects: 5,
          maxCommitsPerProject: 50,
          maxFileSizeMB: 20,
        },
        {
          id: "enterprise",
          name: "Enterprise",
          price: 255,
          currency: "ETB",
          description: "For teams and businesses",
          features: [
            "Unlimited projects",
            "Unlimited commits",
            "100MB file upload limit",

            "Highest priority processing",
            "Dedicated support",
          ],
          maxProjects: -1,
          maxCommitsPerProject: -1,
          maxFileSizeMB: 100,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payment/subscription/status`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Subscription response:", result);
        if (result.success) {
          setUserSubscription(result.data);
        }
      } else {
        console.error("Failed to fetch subscription status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  };
  if (authLoading || !isAuthenticated || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            {authLoading
              ? "Checking authentication..."
              : "Redirecting to login..."}
          </p>
        </div>
      </div>
    );
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <Star className="h-6 w-6" />;
      case "pro":
        return <Zap className="h-6 w-6" />;
      case "enterprise":
        return <Crown className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "free":
        return "border-gray-300";
      case "pro":
        return "border-blue-500";
      case "enterprise":
        return "border-purple-500";
      default:
        return "border-gray-300";
    }
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case "free":
        return "from-gray-50 to-gray-100";
      case "pro":
        return "from-blue-50 to-blue-100";
      case "enterprise":
        return "from-purple-50 to-purple-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  const isCurrentPlan = (planId: string) => {
    return (
      userSubscription?.currentPlan === planId && userSubscription?.isActive
    );
  };

  const getPlanLevel = (planId: string): number => {
    switch (planId) {
      case "free":
        return 1;
      case "pro":
        return 2;
      case "enterprise":
        return 3;
      default:
        return 0;
    }
  };

  const getCurrentPlanLevel = (): number => {
    if (!userSubscription?.currentPlan) return 1;
    return getPlanLevel(userSubscription.currentPlan);
  };

  const isDowngrade = (planId: string) => {
    return getPlanLevel(planId) < getCurrentPlanLevel();
  };

  const handlePlanAction = async (planId: string) => {
    if (!user) {
      toast.error("Please log in to continue");
      router.push("/login");
      return;
    }

    const selectedPlanData = plans.find((p) => p.id === planId);
    if (!selectedPlanData) {
      toast.error("Invalid plan selected");
      return;
    }

    // If it's the current plan
    if (isCurrentPlan(planId)) {
      toast.info(`You are already on the ${selectedPlanData.name} plan`);
      return;
    }

    // If it's a downgrade
    if (isDowngrade(planId)) {
      toast.error(
        `You cannot downgrade to ${selectedPlanData.name} plan. Please contact support.`
      );
      return;
    }

    // If it's free plan
    if (selectedPlanData.price === 0) {
      toast.info("Free plan is automatically activated");
      router.push("/projects");
      return;
    }

    // For upgrade plans, set selected and show payment form
    setSelectedPlan(planId);
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    if (!user) {
      toast.error("Please log in to continue");
      router.push("/login");
      return;
    }

    const selectedPlanData = plans.find((p) => p.id === selectedPlan);
    if (!selectedPlanData) {
      toast.error("Invalid plan selected");
      return;
    }

    // Don't process free plan through payment
    if (selectedPlanData.price === 0) {
      toast.info("Free plan is automatically activated");
      router.push("/projects");
      return;
    }

    // Check if user is already on this plan
    if (isCurrentPlan(selectedPlan)) {
      toast.info(`You are already on the ${selectedPlanData.name} plan`);
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        ...data,
        amount: selectedPlanData.price.toString(),
        plan: selectedPlanData.id,
        userId: user.id, // From auth store
      };

      console.log(
        "Sending payment data to:",
        `${API_BASE_URL}/payment/initialize`
      );

      const response = await fetch(`${API_BASE_URL}/payment/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      console.log("Payment initialization response:", result);

      if (result.success) {
        // Redirect to Chapa checkout
        window.location.href = result.checkout_url;
      } else {
        toast.error(result.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  const getButtonText = (plan: Plan) => {
    if (isCurrentPlan(plan.id)) {
      return "Current Plan";
    }

    if (isDowngrade(plan.id)) {
      return "Downgrade";
    }

    if (plan.price === 0) {
      return "Get Started";
    }

    return selectedPlan === plan.id ? "Selected" : `Select`;
  };

  const getButtonVariant = (plan: Plan) => {
    if (isCurrentPlan(plan.id) || isDowngrade(plan.id)) {
      return "outline";
    }

    if (selectedPlan === plan.id) {
      return "default";
    }

    return "outline";
  };

  const isButtonDisabled = (plan: Plan) => {
    return isCurrentPlan(plan.id) || isDowngrade(plan.id) || isProcessing;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading pricing plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Back to Home Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with our free plan and upgrade as you grow. All plans include
            core features with no hidden fees.
          </p>
        </div>

        {/* Current Plan Badge */}
        {userSubscription && (
          <div className="text-center mb-20">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              Current Plan: {userSubscription.currentPlan}
              {userSubscription.isActive &&
                userSubscription.daysRemaining > 0 && (
                  <span className="ml-2">
                    • {userSubscription.daysRemaining} days remaining
                  </span>
                )}
            </Badge>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                selectedPlan === plan.id ? "ring-2 ring-primary" : ""
              } ${
                isCurrentPlan(plan.id) ? "ring-2 ring-green-500" : ""
              } ${getPlanColor(plan.id)}`}
            >
              {/* Popular Badge for Pro */}
              {plan.id === "pro" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-foreground px-4 py-2">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-foreground px-4 py-2">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader
                className={`text-center pb-4 ${getPlanGradient(
                  plan.id
                )} rounded-t-lg`}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-background">
                    {getPlanIcon(plan.id)}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <p className="text-foreground">{plan.description}</p>

                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-foreground">/month</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="">
                <ul className="space-y-6 mb-20">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Plan Limits */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Plan Limits:</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>
                      • Projects:{" "}
                      {plan.maxProjects === -1
                        ? "Unlimited"
                        : `${plan.maxProjects}/month`}
                    </div>
                    <div>
                      • Commits:{" "}
                      {plan.maxCommitsPerProject === -1
                        ? "Unlimited"
                        : `Up to ${plan.maxCommitsPerProject}/project`}
                    </div>
                    <div>
                      • File Size:{" "}
                      {plan.maxFileSizeMB === -1
                        ? "Unlimited"
                        : `Up to ${plan.maxFileSizeMB}MB`}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handlePlanAction(plan.id)}
                  variant={getButtonVariant(plan)}
                  className="w-full"
                  disabled={isButtonDisabled(plan)}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    getButtonText(plan)
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Payment Form */}
        {selectedPlan &&
          plans.find((p) => p.id === selectedPlan)?.price > 0 && (
            <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Complete Your Purchase
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      {...register("firstName")}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="First Name"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      {...register("lastName")}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Last Name"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    readOnly
                    {...register("email")}
                    className="w-full px-3 py-2 border rounded-md bg-muted"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Selected Plan:</span>
                    <span className="font-semibold">
                      {plans.find((p) => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Amount:</span>
                    <span className="font-bold">
                      {formatPrice(
                        plans.find((p) => p.id === selectedPlan)?.price || 0
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatPrice(
                      plans.find((p) => p.id === selectedPlan)?.price || 0
                    )}`
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You 'll be redirected to Chapa for secure payment processing
                </p>
              </form>
            </div>
          )}

        {/* Free Plan CTA */}
        {selectedPlan &&
          plans.find((p) => p.id === selectedPlan)?.price === 0 && (
            <div className="text-center mt-8">
              <Button onClick={() => router.push("/projects")} size="lg">
                Get Started with Free Plan
              </Button>
            </div>
          )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade your plan at any time. For downgrades,
                please contact support.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Our Free plan is always free with no time limits. Paid plans
                start immediately after payment.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major payment methods through Chapa including
                credit cards, mobile money, and bank transfers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
