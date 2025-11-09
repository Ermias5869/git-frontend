// app/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

interface DashboardData {
  summary: {
    totalProjects: number;
    processedProjects: number;
    pendingProjects: number;
    totalCommits: number;
    successRate: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
    commitCount: number;
    lastCommit: string | null;
    lastCommitDate: string | null;
  }>;
  recentActivity: {
    recentProjects: Array<{
      id: string;
      name: string;
      status: string;
      createdAt: string;
    }>;
    recentCommits: Array<{
      id: string;
      message: string;
      hash?: string;
      createdAt: string;
      projectId: string;
      isAiGenerated?: boolean;
      status?: string;
      project: {
        name: string;
        repoFullName: string;
      };
    }>;
  };
}

interface ProjectStats {
  projectStatus: Array<{ status: string; _count: { id: number } }>;
  commitStats: {
    aiGenerated: number;
    manual: number;
  };
  popularRepos: Array<{
    repoFullName: string;
    commitCount: number;
  }>;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ Dashboard - User authenticated, fetching data");
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard overview
      const overviewResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/overview`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!overviewResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const overviewResult = await overviewResponse.json();

      if (overviewResult.success) {
        setDashboardData(overviewResult.data);
      }

      // Fetch project stat
      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        if (statsResult.success) {
          setProjectStats(statsResult.data);
        }
      }
    } catch (error: unknown) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-6 pb-6">
      <SectionCards dashboardData={dashboardData} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive projectStats={projectStats} />
      </div>
      <DataTable dashboardData={dashboardData} />
    </div>
  );
}

// Skeleton loading component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cards Skeleton */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="px-4 lg:px-6">
        <div className="animate-pulse">
          <div className="h-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="animate-pulse">
        <div className="h-96 rounded-lg bg-gray-200 dark:bg-gray-700 mx-4 lg:mx-6"></div>
      </div>
    </div>
  );
}
