"use client";
import { useEffect, useRef, useState } from "react";
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
  GitCommit,
  Calendar,
  Cpu,
  Cloud,
  Lock,
  Terminal,
  Database,
  Workflow,
  Sparkles,
  Users,
  Star,
  TrendingUp,
  Rocket,
  Code,
  GitPullRequest,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isScrolling, setIsScrolling] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featureCards.length);
    }, 3000);
    return () => clearInterval(featureInterval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const toggleScrolling = () => {
    setIsScrolling(!isScrolling);
  };

  const featureCards = [
    {
      icon: GitCommit,
      title: "Smart Commits",
      description:
        "AI-powered commit messages that follow conventional commit standards",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      title: "Time Travel",
      description:
        "Create commit histories dating back to 2008 with realistic timing",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      icon: Cpu,
      title: "AI Powered",
      description: "Advanced algorithms generate natural development patterns",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your code is processed securely and never stored on our servers",
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description: "Automatic synchronization with your GitHub account",
      color: "from-indigo-500 to-purple-500",
      gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
    },
  ];

  const testimonials = [
    {
      name: "meron tesfaye",
      role: "Software student Student",
      company: "Bahir Dar University",
      content:
        "Gitify helped me build a professional-looking GitHub profile for my portfolio projects. It made my contributions feel real and impressive.",
      avatar: "/avatars/emily.jpg",
    },
    {
      name: "Daniel K/maryam",
      role: "Junior Developer",
      company: "Open Source Contributor",
      content:
        "Using Gitify, I was able to simulate a real development workflow for my learning projects. It’s a great way to practice best Git practices.",
      avatar: "/avatars/daniel.jpg",
    },
    {
      name: "Aisha Mohammed",
      role: "Student Developer",
      company: "Campus Coding Club",
      content:
        "I used Gitify to showcase my school projects with meaningful commit histories. It really helped me stand out during internship applications.",
      avatar: "/avatars/aisha.jpg",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-8 h-8 border-4  rounded-full animate-spin "></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <MaxWidthWrapper className="mb-12 mt-15 sm:mt-30 flex flex-col items-center justify-center text-center relative">
        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 left-10 opacity-60"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Code className="w-8 h-8 text-green-600" />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 opacity-40"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <GitBranch className="w-6 h-6 text-blue-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-border bg-background/80 px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-background/50"
        >
          <Sparkles className="w-4 h-4 text-green-600" />
          <p className="text-sm font-semibold text-foreground">
            Gitify is now live!
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl"
        >
          Make Your Repository{" "}
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Look Legendary
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-5 max-w-prose text-muted-foreground sm:text-lg"
        >
          Upload your files, choose your timeline, and let AI create a stunning
          commit history — from 2008 to today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <button
            onClick={handleGetStarted}
            className="group relative inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button className="group inline-flex items-center justify-center rounded-full border border-border bg-background/80 px-8 py-4 text-sm font-medium text-foreground backdrop-blur transition-all hover:scale-105 hover:shadow-xl">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </button>
        </motion.div>

        {!isAuthenticated && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground hover:underline font-semibold"
            >
              Sign in
            </Link>
          </motion.p>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-3 gap-8"
        >
          {[
            { number: "100+", label: "Developers" },
            { number: "500+", label: "Repositories" },
            { number: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </MaxWidthWrapper>

      {/* Animated Demo Section */}
      <div className="relative isolate overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-6xl px-6 lg:px-8"
        >
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 p-2 ring-1 ring-inset ring-green-500/20 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="rounded-md bg-card shadow-2xl ring-1 ring-border overflow-hidden">
                <Image
                  src="/dashboard.png"
                  alt="Gitify App Screenshot"
                  width={1200}
                  height={675}
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Background Blobs */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-32 w-64 h-64 bg-green-300 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-32 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-20"
        />
      </div>

      {/* Features Grid Section */}
      <div className="py-20 bg-background/50">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-600 mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Why Developers Love Gitify
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create professional GitHub histories with
              AI-powered magic
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-8 bg-card border border-border rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${feature.gradient}`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-green-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-b from-background to-background/80">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold tracking-tight mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get your repository looking professional in just three simple
              steps
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-blue-500 transform -translate-x-1/2 hidden lg:block" />

            <div className="space-y-12 lg:space-y-0">
              {[
                {
                  step: "01",
                  icon: Zap,
                  title: "Create Repository",
                  description:
                    "Name your repository and add a short description. The system sets it up automatically through your GitHub account.",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  step: "02",
                  icon: Clock,
                  title: "Upload & Generate",
                  description:
                    "Upload your project files. AI generates commits across multiple timestamps to build a natural contribution history.",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: "03",
                  icon: Mail,
                  title: "Get Notification",
                  description:
                    "Sit back for about 2 minutes. Once the commits are complete, you'll receive an email confirming your project is ready.",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={cn(
                    "relative flex flex-col lg:flex-row items-center gap-8",
                    index % 2 === 0 ? "lg:flex-row-reverse" : ""
                  )}
                >
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}
                      >
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  {/* Spacer for even steps */}
                  <div className="flex-1 lg:block hidden" />
                </motion.div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-background">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 mb-4">
              <Star className="h-4 w-4 mr-2" />
              Trusted by Developers
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-6">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{testimonial.content}"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-card">
        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-foreground"
          >
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your Git History?
            </h2>
            <p className="text-xl mb-8 text-foreground max-w-2xl mx-auto">
              Join thousands of developers who are already creating
              professional, AI-powered commit histories with Gitify.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-2xl"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group inline-flex items-center justify-center rounded-full border text-foreground bg-primary-foreground px-8 py-4 text-sm font-medium text-foregroundtransition-all hover:scale-105 hover:bg-white/10">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4  text-sm">
              <div className="flex items-center text-foreground">
                <CheckCircle className="w-4 h-4 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center text-foreground">
                <CheckCircle className="w-4 h-4 mr-2" />1 project free trial
              </div>
              <div className="flex items-center text-foreground">
                <CheckCircle className="w-4 h-4 mr-2" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
