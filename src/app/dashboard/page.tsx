// app/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { toast } from "sonner";

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
    commits: Array<any>;
    notifications: Array<any>;
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard overview
      const overviewResponse = await fetch(
        "http://localhost:3001/api/dashboard/overview",
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

      // Fetch project stats
      const statsResponse = await fetch(
        "http://localhost:3001/api/dashboard/stats",
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
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <SectionCards dashboardData={dashboardData} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive projectStats={projectStats} />
      </div>
      <DataTable dashboardData={dashboardData} />
    </>
  );
}

// Skeleton loading component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cards Skeleton */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
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
