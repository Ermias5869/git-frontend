// components/login-navbar.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginNavbar() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Back button and branding */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-green-600" />
              <span className="font-bold text-xl">CommitForge</span>
            </Link>
          </div>

          {/* Right side - Simple branding */}
          <div className="text-sm text-muted-foreground">
            Sign in to continue
          </div>
        </div>
      </div>
    </nav>
  );
}
