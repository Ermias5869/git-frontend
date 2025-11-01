"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

export default function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const { initializeFromRedirect } = useAuthStore();

  useEffect(() => {
    const userParam = searchParams.get("user");
    if (userParam) {
      const userData = JSON.parse(decodeURIComponent(userParam));
      initializeFromRedirect(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }, [searchParams, initializeFromRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Authentication Successful</h2>
        <p className="text-muted-foreground">Completing login process...</p>
      </div>
    </div>
  );
}
