// components/chart-area-interactive.tsx
"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

interface ProjectData {
  date: string;
  projects: number;
  commits: number;
}
interface Project {
  id: string;
  name: string;
  description?: string;
  zipPath?: string;
  repoFullName?: string;
  repoUrl?: string;
  branch?: string;
  startDate?: string;
  endDate?: string;
  desiredCommitCount?: number;
  status: string;
  userId: string;
  commits: Array<{ id: string }> | [];
  createdAt: string;
  updatedAt: string;
  processingLockedUntil?: string;
  processingStartedAt?: string;
  processingEndedAt?: string;
  errorMessage?: string;
  _count?: {
    commits: number;
  };
}
interface ChartAreaInteractiveProps {
  projectStats?: {
    projectStatus: Array<{ status: string; _count: { id: number } }>;
    commitStats: {
      aiGenerated: number;
      manual: number;
    };
  } | null;
}

const chartConfig = {
  projects: {
    label: "Projects",
    color: "hsl(222.2 84% 4.9%)",
  },
  commits: {
    label: "Commits",
    color: "hsl(142.1 76.2% 36.3%)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({}: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("90d"); // Default to 90d to show all data
  const [chartType, setChartType] = React.useState<"area" | "bar">("area");
  const [chartData, setChartData] = React.useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasRealData, setHasRealData] = React.useState(false);

  // Fetch real project data from backend
  React.useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);

        console.log("🔄 Fetching projects for chart...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📡 Chart API Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Chart API Response:", result);

        if (result.success && result.data) {
          // Process the real project data
          const processedData = processProjectData(result.data);
          console.log("📊 Processed project data for chart:", processedData);
          setChartData(processedData);
          setHasRealData(true);
          toast.success(`Loaded ${result.data.length} projects`);
        } else {
          throw new Error(result.error || "Failed to fetch projects");
        }
      } catch (error: unknown) {
        console.error("❌ Failed to fetch project data:", error);
        toast.error("Failed to load project analytics - using sample data");
        // Fallback to sample data if API fails
        setChartData(generateFallbackData());
        setHasRealData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  // Process real project data from backend
  const processProjectData = (projects: Project[]): ProjectData[] => {
    if (!projects || projects.length === 0) {
      console.log("No projects found, using fallback data");
      return generateFallbackData();
    }

    console.log(`Processing ${projects.length} projects from database`);

    // Group projects by creation date
    const projectsByDate: {
      [key: string]: { projects: number; commits: number };
    } = {};

    projects.forEach((project) => {
      if (!project.createdAt) {
        console.log("Project missing createdAt:", project.id);
        return;
      }

      try {
        const date = new Date(project.createdAt);
        const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

        if (!projectsByDate[dateKey]) {
          projectsByDate[dateKey] = { projects: 0, commits: 0 };
        }

        projectsByDate[dateKey].projects += 1;

        // Add commit count if available
        if (project._count?.commits) {
          projectsByDate[dateKey].commits += project._count.commits;
        } else if (project.commits && Array.isArray(project.commits)) {
          projectsByDate[dateKey].commits += project.commits.length;
        }

        console.log(
          `Project ${project.id}: ${dateKey} - ${projectsByDate[dateKey].projects} projects, ${projectsByDate[dateKey].commits} commits`
        );
      } catch (error) {
        console.error(
          "Error processing project date:",
          project.createdAt,
          error
        );
      }
    });

    // Convert to array and sort by date
    const result = Object.entries(projectsByDate)
      .map(([date, data]) => ({
        date,
        projects: data.projects,
        commits: data.commits,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log(`Processed ${result.length} days of project data`);

    // If we have data, return it
    if (result.length > 0) {
      return result;
    }

    // Fallback if no valid data
    console.log("No valid project dates found, using fallback data");
    return generateFallbackData();
  };

  // Generate fallback data when no real data is available
  const generateFallbackData = (): ProjectData[] => {
    const today = new Date();
    const data: ProjectData[] = [];

    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      data.push({
        date: dateKey,
        projects: Math.floor(Math.random() * 3) + 1, // 1-3 projects
        commits: Math.floor(Math.random() * 15) + 5, // 5-20 commits
      });
    }

    return data;
  };

  // Filter data based on time range - FIXED to handle future dates
  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return [];

    console.log("Original chart data:", chartData);

    // For real data, show all available data regardless of time range
    if (hasRealData) {
      console.log("Using real data, showing all dates:", chartData);
      return chartData;
    }

    // For sample data, apply time range filtering
    const today = new Date();
    let daysToInclude = 7;

    if (timeRange === "30d") {
      daysToInclude = 30;
    } else if (timeRange === "90d") {
      daysToInclude = 90;
    }

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToInclude);

    const filtered = chartData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });

    console.log("Filtered sample data:", filtered);
    return filtered;
  }, [timeRange, chartData, hasRealData]);

  // Custom tooltip formatter
  const customTooltipFormatter = (value: number, name: string) => {
    return [value, name];
  };

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Project Analytics</CardTitle>
          <CardDescription>Loading project data...</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[250px] w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="text-muted-foreground">
                Loading project data...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Project Analytics</CardTitle>
        </div>
        <CardAction className="flex gap-2">
          <ToggleGroup
            type="single"
            value={chartType}
            onValueChange={(value: "area" | "bar") => {
              if (value) setChartType(value);
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-3! @[767px]/card:flex"
          >
            <ToggleGroupItem value="area">Area</ToggleGroupItem>
            <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
          </ToggleGroup>

          {!hasRealData && (
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => {
                if (value) setTimeRange(value);
              }}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-3! @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">3M</ToggleGroupItem>
              <ToggleGroupItem value="30d">1M</ToggleGroupItem>
              <ToggleGroupItem value="7d">7D</ToggleGroupItem>
            </ToggleGroup>
          )}

          {!hasRealData && (
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 7 days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="h-[250px] w-full flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              No data available for the selected time range
            </div>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              {chartType === "area" ? (
                <AreaChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorProjects"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopOpacity={0.8} />
                      <stop offset="95%" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorCommits"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopOpacity={0.8} />
                      <stop offset="95%" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => {
                      return `Date: ${new Date(value).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}`;
                    }}
                    formatter={customTooltipFormatter}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="projects"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorProjects)"
                  />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorCommits)"
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => {
                      return `Date: ${new Date(value).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}`;
                    }}
                    formatter={customTooltipFormatter}
                  />
                  <Legend />
                  <Bar dataKey="projects" fill="#8884d8" />
                  <Bar dataKey="commits" fill="#82ca9d" />
                </BarChart>
              )}
            </ChartContainer>

            {/* Show data summary */}
            <div className="mt-4 text-sm text-muted-foreground">
              {hasRealData ? (
                <>
                  Showing {filteredData.length} days of{" "}
                  <strong>project data</strong>
                  {filteredData.length > 0 && (
                    <span>
                      {" "}
                      ({new Date(
                        filteredData[0].date
                      ).toLocaleDateString()} -{" "}
                      {new Date(
                        filteredData[filteredData.length - 1].date
                      ).toLocaleDateString()}
                      )
                    </span>
                  )}
                </>
              ) : (
                "Showing sample project data for demonstration"
              )}
            </div>

            {/* Debug info */}
            <div className="mt-2 text-xs text-gray-500">
              Data points: {filteredData.length} | Total projects:{" "}
              {filteredData.reduce((sum, item) => sum + item.projects, 0)} |
              Total commits:{" "}
              {filteredData.reduce((sum, item) => sum + item.commits, 0)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
