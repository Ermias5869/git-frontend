"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight, GitBranch, Zap, Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-20 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-border bg-background px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-background/50">
          <GitBranch className="h-4 w-4 text-green-600" />
          <p className="text-sm font-semibold text-foreground">
            Luna is now live!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Professional Git history{" "}
          <span className="text-green-600">for any project</span>
        </h1>
        <p className="mt-5 max-w-prose text-muted-foreground sm:text-lg">
          Upload your code, select your commit timeline, and receive
          AI-generated commit messages that make your project look like it was
          built by a seasoned developer.
        </p>

        <button
          onClick={handleGetStarted}
          className="inline-flex items-center mt-5 justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>

        {!isAuthenticated && (
          <p className="mt-3 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </MaxWidthWrapper>

      {/* Value proposition section */}
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#10b981] to-[#059669] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-gray-100/5 dark:ring-gray-100/10">
                  <div className="rounded-md bg-card p-8 md:p-20 shadow-2xl ring-1 ring-border flex items-center justify-center">
                    <div className="text-center">
                      <GitBranch className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-card-foreground">
                        CommitForge Dashboard
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        {isAuthenticated
                          ? `Welcome back! Manage your AI-generated commit projects`
                          : "Manage your AI-generated commit projects after signing in"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#10b981] to-[#059669] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-foreground sm:text-5xl">
              Generate commit history in 3 steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Transform your empty repository into a professional project
              history with AI-powered commits.
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-green-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-600">Step 1</span>
              <span className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Connect GitHub
              </span>
              <span className="mt-2 text-muted-foreground">
                Link your GitHub account and create a new repository for your
                project.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-green-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-600">Step 2</span>
              <span className="text-xl font-semibold flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Upload Codebase
              </span>
              <span className="mt-2 text-muted-foreground">
                Upload your project files as a ZIP. AI analyzes your code
                structure and patterns.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-green-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-green-600">Step 3</span>
              <span className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Generate Commits
              </span>
              <span className="mt-2 text-muted-foreground">
                AI creates meaningful commit history with proper messages and
                timelines.
              </span>
            </div>
          </li>
        </ol>

        {/* Features Grid */}
        <div className="mx-auto max-w-5xl mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6 border border-border rounded-lg bg-card">
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Intelligent commit messages that understand your code
              </p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg bg-card">
              <GitBranch className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real GitHub Repos</h3>
              <p className="text-muted-foreground">
                Creates actual repositories on your GitHub account
              </p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg bg-card">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your code is processed securely and never stored
              </p>
            </div>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to transform your project history?
          </h3>
          <p className="text-muted-foreground mb-6">
            {isAuthenticated
              ? "Start creating professional commit histories now!"
              : "Start with our free plan or unlock unlimited commits with Pro."}
          </p>
          <button
            onClick={handleGetStarted}
            className={buttonVariants({
              size: "lg",
              className: "bg-green-600 hover:bg-green-700 text-white",
            })}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          </button>
        </div>
      </div>
    </>
  );
}
