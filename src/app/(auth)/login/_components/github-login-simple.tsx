"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function GitHubAuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:3001/api/auth/github";
  };

  const features = [
    "Access your repositories",
    "Sync your projects",
    "Automated deployments",
  ];

  const listVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-500">
      <Card className="w-full max-w-md border bg-card text-card-foreground shadow-lg transition-colors duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Github className="h-6 w-6 text-foreground" />
          </div>

          <CardTitle className="text-2xl font-semibold">
            Continue with GitHub
          </CardTitle>
          <CardDescription>
            Connect your GitHub account to get started with our platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Animated Feature List */}
          <motion.ul
            initial="hidden"
            animate="visible"
            className="space-y-3 text-sm text-muted-foreground"
          >
            {features.map((feature, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={listVariants}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="h-2 w-2 rounded-full bg-green-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.15 + 0.2 }}
                />
                {feature}
              </motion.li>
            ))}
          </motion.ul>

          {/* GitHub Login Button */}
          <Button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Connecting to GitHub...</span>
              </>
            ) : (
              <>
                <Github className="h-5 w-5" />
                Continue with GitHub
              </>
            )}
          </Button>

          {/* Privacy Text */}
          <p className="text-xs text-center text-muted-foreground mt-2">
            By continuing, you agree to our{" "}
            <span className="text-green-500 hover:underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and acknowledge our{" "}
            <span className="text-green-500 hover:underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
