import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, GitBranch } from "lucide-react";
import { ModeToggle } from "./darkToggle";

export function Navbar() {
  return (
    <nav className="sticky h-16  w-full  border-border bg-background/75 backdrop-blur-lg transition-all">
      <div className="flex h-16 items-center justify-between border-border px-4">
        <Link href="/" className="flex z-40 font-semibold items-center gap-2">
          <span className="text-2xl ml-2font-bold text-foreground ">
            Lun<span className="text-green-500">a</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
            })}
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-foreground hover:bg-green-700 transition-colors"
          >
            Get started <ArrowRight className="ml-1.5 h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-foreground hover:bg-green-700 transition-colors"
          >
            Sign in
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
