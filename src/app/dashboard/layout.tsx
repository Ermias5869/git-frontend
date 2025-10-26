// app/dashboard/layout.tsx
"use client";
import { ReactNode, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    isAuthenticated,
    isLoading,
    initializeFromRedirect,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First priority: Check if we have user data from URL (GitHub OAuth redirect)
        const userParam = searchParams.get("user");

        if (userParam) {
          // Case 1: Coming from GitHub OAuth redirect
          const userData = JSON.parse(decodeURIComponent(userParam));
          console.log(
            "🚀 Storing user data from OAuth redirect:",
            userData.username
          );

          // Store in Zustand and localStorage
          initializeFromRedirect(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          // Clean the URL immediately
          window.history.replaceState({}, "", "/dashboard");
        } else {
          // Case 2: Check existing authentication
          checkAuth();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        router.push("/login");
      }
    };

    initializeAuth();
  }, [searchParams, initializeFromRedirect, checkAuth, router]);

  useEffect(() => {
    // Redirect to login if not authenticated (after processing everything)
    if (!isLoading && !isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
