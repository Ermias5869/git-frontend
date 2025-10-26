"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    // Await the params
    const getParams = async () => {
      const resolvedParams = await params;
      setTxId(resolvedParams.txId);
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (!txId) return;

    const verifyPayment = async () => {
      try {
        setLoading(true);
        console.log("Verifying payment with txId:", txId);

        const response = await fetch(
          `http://localhost:3001/api/payment/verify?tx_ref=${txId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // Add timeout
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
        } else {
          setError(data.message || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Fetch error details:", err);

        if (err.name === "AbortError") {
          setError("Verification timeout. Please try again.");
        } else if (err.name === "TypeError") {
          setError(
            "Cannot connect to server. Please check if the backend is running."
          );
        } else {
          setError(
            err.message || "Failed to verify payment. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [txId]);

  // ... rest of your component remains the same
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
          {txId && (
            <p className="mt-2 text-sm text-gray-500">Transaction: {txId}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Verification Error
          </h1>
          <p className="mt-2 text-gray-600">{error}</p>
          {txId && (
            <p className="mt-2 text-sm text-gray-500">Transaction: {txId}</p>
          )}
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry Verification
            </button>
            <button
              onClick={() => router.push("/projects")}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Go to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🎉</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Payment Successful!
          </h1>

          <p className="mt-2 text-gray-600">
            Thank you for your payment. Your plan has been upgraded.
          </p>

          {/* Payment Details */}
          <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">Payment Details</h3>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">{txId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span>{verification?.data.order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="capitalize">
                  {verification?.data.order.plan}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span>{verification?.data.order.amount} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">
                  {verification?.data.order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => router.push("/projects")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Projects
            </button>
            <button
              onClick={() => router.push("/projects/new")}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Project
            </button>
          </div>

          {/* Additional Info */}
          <p className="mt-6 text-xs text-gray-500">
            You can now create projects according to your new plan limits. A
            confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
