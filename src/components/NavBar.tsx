"use client";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "./darkToggle";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { RedirectManager } from "@/lib/redirect";

export function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      RedirectManager.setRedirectPath("/dashboard");
      router.push("/login");
    }
  };
  return (
    <nav className="sticky h-16  w-full  border-border bg-background/75 backdrop-blur-lg transition-all">
      <div className="flex h-16 items-center justify-between border-border px-4">
        <Link href="/" className="flex z-40 font-semibold items-center gap-2">
          <span className="text-2xl ml-2font-bold text-foreground ">Luna</span>
        </Link>

        <div className="flex items-center space-x-4">
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
      </div>
    </nav>
  );
}
