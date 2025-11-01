// app/(auth)/success/layout.tsx
"use client";
import { ReactNode, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { RedirectManager } from "@/lib/redirect";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { initializeFromRedirect, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First priority: Check if we have user data from URL (GitHub OAuth redirect)
        const userParam = searchParams.get("user");

        if (userParam) {
          // Case 1: Coming from GitHub OAuth redirect
          const userData = JSON.parse(decodeURIComponent(userParam));
          console.log(
            "🚀 Root layout - Storing user data from OAuth redirect:",
            userData.username
          );

          // Store in Zustand and localStorage
          initializeFromRedirect(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          // Get redirect path and redirect if needed
          const redirectPath = RedirectManager.getRedirectPath();
          console.log("📍 Root layout - Redirect path:", redirectPath);

          if (redirectPath && redirectPath !== pathname) {
            console.log("🔄 Root layout - Redirecting to:", redirectPath);
            RedirectManager.clearRedirectPath();

            // Use window.location for full page reload to ensure clean state
            window.location.href = redirectPath;
            return;
          }

          // Clean the URL if staying on current page
          if (userParam) {
            window.history.replaceState({}, "", pathname);
          }
        } else {
          // Case 2: Check existing authentication
          console.log("🔍 Root layout - Checking existing auth");
          checkAuth();
        }
      } catch (error) {
        console.error("Root layout auth initialization error:", error);
      }
    };

    initializeAuth();
  }, [searchParams, initializeFromRedirect, checkAuth, pathname]);

  // Show loading state while initializing auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
