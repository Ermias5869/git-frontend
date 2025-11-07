"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  GitBranch,
  Zap,
  Shield,
  Mail,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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
    return <Spinner />;
  }

  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-15 sm:mt-30 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-border bg-background px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-background/50">
          <p className="text-sm font-semibold text-foreground">
            Gitify is now live!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Make Your Repository{" "}
          <span className="text-green-600">Look Legendary</span>
        </h1>
        <p className="mt-5 max-w-prose text-muted-foreground sm:text-lg">
          Upload your files, choose your timeline, and let AI create a stunning
          commit history — from 2008 to today.
        </p>

        <button
          onClick={handleGetStarted}
          className="inline-flex items-center mt-5 justify-center rounded-md bg-foreground  px-6 py-3 text-sm font-medium text-primary-foreground transition-colors"
        >
          {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>

        {!isAuthenticated && (
          <p className="mt-3 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground hover:underline">
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
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-gray-100/5 dark:ring-gray-100/10">
                  <div className="rounded-md bg-card shadow-2xl ring-1 ring-border flex items-center justify-center">
                    <Image
                      src="/dashboard.png"
                      alt="Gitify App Screenshot"
                      width={720}
                      height={400}
                      className="w-full h-auto rounded-md border border-border shadow-lg"
                    />
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
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg]  opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl sm:text-5xl">
              Create a professional commit history — fast
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              AI-generated commits to populate a repo — safely, retroactively,
              and with verifiable author info.
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          {/* Step 1 */}
          <li className="md:flex-1 border border-border rounded-lg p-10 shadow-sm bg-card">
            <div className="flex flex-col space-y-2 py-2 pl-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium">Step 1</span>
              <span className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Create Repository
              </span>
              <span className="mt-2 text-muted-foreground">
                Name your repository and add a short description. The system
                sets it up automatically through your GitHub account.
              </span>
            </div>
          </li>

          {/* Step 2 */}
          <li className="md:flex-1 border border-border rounded-lg p-10 shadow-sm bg-card">
            <div className="flex flex-col space-y-2 py-2 pl-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium">Step 2</span>
              <span className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Upload Files & Generate Commits
              </span>
              <span className="mt-2 text-muted-foreground">
                Upload your project files. AI generates commits across multiple
                timestamps—even from past years—to build a natural contribution
                history.
              </span>
            </div>
          </li>

          {/* Step 3 */}
          <li className="md:flex-1 border border-border rounded-lg p-10 shadow-sm bg-card">
            <div className="flex flex-col space-y-2 py-2 pl-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium">Step 3</span>
              <span className="text-xl font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Get Email Notification
              </span>
              <span className="mt-2 text-muted-foreground">
                Sit back for about 2 minutes. Once the commits are complete,
                you’ll receive an email confirming your project is ready.
              </span>
            </div>
          </li>
        </ol>

        <section className="mx-auto max-w-6xl mt-20 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Powerful automation for your GitHub workflow
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Create real repositories, generate meaningful commits, and track
            everything in one place.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Feature 1 */}
            <div className="group p-6 border border-border rounded-2xl bg-card shadow-sm hover:shadow-md transition-all duration-300">
              <GitBranch className="h-10 w-10 text-foreground mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">
                Real Repositories with Historical Commits
              </h3>
              <p className="text-muted-foreground">
                Instantly create real GitHub repositories populated with
                authentic-looking commit timelines — even extending to previous
                years like 2021 or 2019.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 border border-border rounded-2xl bg-card shadow-sm hover:shadow-md transition-all duration-300">
              <Zap className="h-10 w-10 text-foreground mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">
                AI-Generated Commit Messages
              </h3>
              <p className="text-muted-foreground">
                Each commit message is written by AI — concise, descriptive, and
                aligned with professional coding standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 border border-border rounded-2xl bg-card shadow-sm hover:shadow-md transition-all duration-300">
              <LayoutDashboard className="h-10 w-10 text-foreground mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">
                Clean Project Dashboard
              </h3>
              <p className="text-muted-foreground">
                Monitor repositories, commits, and progress from an elegant,
                analytics-ready dashboard designed for clarity and speed.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="group p-6 border border-border rounded-2xl bg-card shadow-sm hover:shadow-md transition-all duration-300">
              <Shield className="h-10 w-10 text-foreground mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Your Code Is Safe</h3>
              <p className="text-muted-foreground">
                Security first — your code is processed securely and never
                stored. You always stay in control.
              </p>
            </div>
          </div>
        </section>

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
              className: " text-primary-foreground",
            })}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          </button>
        </div>
      </div>
    </>
  );
}
