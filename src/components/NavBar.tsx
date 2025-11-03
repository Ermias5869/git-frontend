"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./darkToggle";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { RedirectManager } from "@/lib/redirect";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      RedirectManager.setRedirectPath("/dashboard");
      router.push("/login");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky h-16 w-full border-border bg-background/75 backdrop-blur-lg transition-all">
        <div className="flex h-16 items-center justify-between border-border px-4">
          <Link href="/" className="flex z-40 font-semibold items-center gap-2">
            <span className="text-2xl ml-2 font-bold text-foreground">
              Luna
            </span>
          </Link>

          {/* Desktop Navigation - EXACTLY like your original */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/pricing"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Pricing
            </Link>
            <Button onClick={handleGetStarted} size="lg">
              Get Started Free
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="relative z-50"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Only render after mount */}
        {isMounted && (
          <>
            {/* Backdrop Overlay */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
                onClick={closeMobileMenu}
              />
            )}

            {/* Mobile Menu Panel */}
            <div
              className={`
              fixed top-0 right-0 h-full w-80 max-w-[85vw] border-l border-border 
              shadow-xl z-50 md:hidden
              transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
            >
              <div className="flex flex-col h-full pt-16 p-6">
                {/* Close button */}
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                    <X size={24} />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col space-y-4 mt-4">
                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      router.push("/pricing");
                    }}
                    size="lg"
                    className="h-12 text-base font-semibold"
                  >
                    Pricing
                  </Button>
                  <Button
                    onClick={() => {
                      closeMobileMenu();
                      handleGetStarted();
                    }}
                    size="lg"
                    className="h-12 text-base font-semibold"
                  >
                    Get Started Free
                  </Button>
                </div>

                {/* Spacer */}
                <div className="flex-grow" />
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Prevent body scroll when mobile menu is open */}
      {isMounted && isMobileMenuOpen && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
    </>
  );
}
