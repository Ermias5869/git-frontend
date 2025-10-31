import GitHubAuthPage from "./_components/github-login-simple";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* GitHub Auth Component */}
      <GitHubAuthPage />
    </div>
  );
}
