// app/projects/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Folder,
  Globe,
  Code,
  GitBranch,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  RefreshCw,
  Users,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
  userId: string;
  _count?: {
    deployments?: number;
    commits?: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔄 Fetching projects from API...");

      const response = await fetch("http://localhost:3001/api/projects", {
        method: "GET",
        credentials: "include", // This will include cookies for JWT auth
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 API Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your projects");
        } else if (response.status === 404) {
          throw new Error(
            "Projects endpoint not found. Please check the backend URL."
          );
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();
      console.log("✅ API Response data:", result);

      if (result.success) {
        setProjects(result.data || []);
        setFilteredProjects(result.data || []);
        if (result.data?.length > 0) {
          toast.success(`Loaded ${result.data.length} projects`);
        }
      } else {
        throw new Error(result.error || "Failed to fetch projects");
      }
    } catch (error: any) {
      console.error("❌ Failed to fetch projects:", error);
      setError(error.message);
      toast.error(error.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "ARCHIVED":
        return <Badge variant="secondary">Archived</Badge>;
      case "INACTIVE":
        return (
          <Badge variant="outline" className="text-gray-600">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProjectIcon = (project: Project) => {
    if (project.liveUrl) return <Globe className="h-5 w-5 text-blue-500" />;
    if (project.repositoryUrl)
      return <GitBranch className="h-5 w-5 text-purple-500" />;
    return <Folder className="h-5 w-5 text-yellow-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <Code className="h-6 w-6" />
                Unable to Load Projects
              </CardTitle>
              <CardDescription className="text-red-700">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">
                  Troubleshooting Steps:
                </h4>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>Ensure you are logged in</li>
                  <li>Check if backend is running on localhost:3001/api</li>
                  <li>Verify your JWT token is valid</li>
                  <li>Check browser console for detailed errors</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={fetchProjects}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>

              <div className="p-3 bg-gray-100 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">
                  Debug Information:
                </h4>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>API Endpoint:</strong>{" "}
                    http://localhost:3001/api/projects
                  </p>
                  <p>
                    <strong>Method:</strong> GET
                  </p>
                  <p>
                    <strong>Credentials:</strong> include (sends cookies)
                  </p>
                  <p>
                    <strong>Expected Response:</strong> &#123; success: boolean,
                    data: Project[] &#125;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-2">
              Manage and deploy your GitHub repositories
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchProjects}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>
              {projects.filter((p) => p.status === "ACTIVE").length} active
            </span>
            <span>•</span>
            <span>
              {projects.filter((p) => p.status === "PENDING").length} pending
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first project from a GitHub repository"}
              </p>
              {!searchQuery && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={fetchProjects}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: Project;
  onUpdate: () => void;
}

function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "ARCHIVED":
        return <Badge variant="secondary">Archived</Badge>;
      case "INACTIVE":
        return (
          <Badge variant="outline" className="text-gray-600">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProjectIcon = (project: Project) => {
    if (project.liveUrl) return <Globe className="h-5 w-5 text-blue-500" />;
    if (project.repositoryUrl)
      return <GitBranch className="h-5 w-5 text-purple-500" />;
    return <Folder className="h-5 w-5 text-yellow-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewCommits = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/projects/${project.id}/commits`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Commits data:", result);
        toast.success(`Found ${result.count} commits`);
      }
    } catch (error) {
      toast.error("Failed to load commits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/projects/${project.id}/stats`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Stats data:", result);
        toast.success("Project stats loaded");
      }
    } catch (error) {
      toast.error("Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:border-blue-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              {getProjectIcon(project)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {project.name}
              </CardTitle>
              {getStatusBadge(project.status)}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {project.description && (
          <CardDescription className="mt-2 line-clamp-2">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Project Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.updatedAt)}</span>
            </div>
            {project._count?.commits !== undefined && (
              <div className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span>{project._count.commits}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {project.repositoryUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(project.repositoryUrl, "_blank")}
              >
                <GitBranch className="h-3 w-3 mr-1" />
                Repository
              </Button>
            )}

            {project.liveUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(project.liveUrl, "_blank")}
              >
                <Globe className="h-3 w-3 mr-1" />
                Live Demo
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={handleViewCommits}
              disabled={isLoading}
            >
              <Code className="h-3 w-3 mr-1" />
              Commits
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={handleViewStats}
              disabled={isLoading}
            >
              <Users className="h-3 w-3 mr-1" />
              Stats
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Loading Component
function ProjectSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
