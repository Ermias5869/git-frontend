// app/projects/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  GitBranch,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  FolderOpen,
  User,
  Code,
  BarChart3,
  Github,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  repoFullName: string;
  repoUrl: string;
  branch: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  desiredCommitCount?: number;

  user?: {
    username: string;
    email: string;
    plan: string;
  };
}

interface Commit {
  id: string;
  message: string;
  commitDate: string;
  githubSha?: string;
  aiGenerated: boolean;
  status: string;
  project?: {
    name: string;
    repoFullName: string;
  };
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectCommits();
  }, [projectId]);
  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Project deleted successfully");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }

      const result = await response.json();
      if (result.success) {
        setProject(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch project");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectCommits = async () => {
    try {
      setCommitsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/commits`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch commits");
      }

      const result = await response.json();
      if (result.success) {
        setCommits(result.data || []);
        console.log("commits:", commits);
      } else {
        throw new Error(result.error || "Failed to fetch commits");
      }
    } catch (error) {
      console.error("Error fetching commits:", error);
      toast.error("Failed to load commits");
    } finally {
      setCommitsLoading(false);
    }
  };

  const handleRetryProject = async () => {
    try {
      setIsRetrying(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/retry`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Project queued for retry!");
        // Refresh project details after a delay
        setTimeout(() => fetchProjectDetails(), 2000);
      } else {
        toast.error(result.error || "Failed to retry project");
      }
    } catch (error) {
      console.error("Retry error:", error);
      toast.error("Failed to retry project");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "commits" && commits.length === 0) {
      fetchProjectCommits();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      created: { label: "Created", variant: "secondary" as const },
      pending: { label: "Pending", variant: "secondary" as const },
      processing: { label: "Processing", variant: "secondary" as const },
      processed: { label: "Completed", variant: "default" as const },
      failed: { label: "Failed", variant: "destructive" as const },
    };

    const config = statusConfig[
      status.toLowerCase() as keyof typeof statusConfig
    ] || { label: status, variant: "outline" as const };

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Button asChild>
            <a href="/projects">Back to Projects</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {project.status.toLowerCase() === "failed" && (
            <Button
              onClick={handleRetryProject}
              disabled={isRetrying}
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Retrying..." : "Retry Project"}
            </Button>
          )}
          <Button asChild>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <Tabs
        defaultValue="overview"
        className="space-y-6"
        onValueChange={handleTabChange}
      >
        <TabsList className="bg-background">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            Overview
          </TabsTrigger>
          <TabsTrigger value="commits" className="flex items-center gap-2">
            Commits ({project.desiredCommitCount || 0})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Status Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                {getStatusIcon(project.status)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getStatusBadge(project.status)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Current processing status
                </p>
              </CardContent>
            </Card>

            {/* Commits Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commits</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.desiredCommitCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.desiredCommitCount
                    ? `${project.desiredCommitCount || 0} of ${
                        project.desiredCommitCount
                      } generated`
                    : "Total commits generated"}
                </p>
                {project.desiredCommitCount && (
                  <Progress
                    value={
                      ((commits.filter((c) => c.aiGenerated).length || 0) /
                        Number(project.desiredCommitCount)) *
                      100
                    }
                    className="mt-2"
                  />
                )}
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Timeline</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {project.startDate && project.endDate ? (
                    <>
                      <div className="text-sm">
                        {formatDate(project.startDate)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        to {formatDate(project.endDate)}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No timeline specified
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Repository Information</CardTitle>
                <CardDescription>GitHub repository details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Repository:</span>
                  <span className="text-sm">{project.repoFullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Branch:</span>
                  <span className="text-sm">{project.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm">
                    {formatDate(project.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Details</CardTitle>
                <CardDescription>Commit generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Target Commits:</span>
                  <span className="text-sm">
                    {project.desiredCommitCount || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">AI Generated:</span>
                  <span className="text-sm">
                    {commits.filter((c) => c.aiGenerated).length} commits
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Successful Commits:
                  </span>
                  <span className="text-sm">
                    {commits.filter((c) => c.githubSha).length} commits
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Commits Tab */}
        <TabsContent value="commits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commit History</CardTitle>
              <CardDescription>
                {commits.length} commits generated for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commitsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <p>Loading commits...</p>
                </div>
              ) : commits.length > 0 ? (
                <div className="space-y-4">
                  {commits.map((commit) => (
                    <div
                      key={commit.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {commit.githubSha ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{commit.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDate(commit.commitDate)}</span>
                          {commit.aiGenerated && (
                            <Badge variant="outline" className="text-xs">
                              AI Generated
                            </Badge>
                          )}
                          {commit.githubSha && (
                            <Badge variant="secondary" className="text-xs">
                              Pushed to GitHub
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No commits generated yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Re-process Project */}
              {project.status === "failed" && (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Re-process Project</p>
                    <p className="text-sm text-muted-foreground">
                      Generate commits again with current settings
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRetryProject}
                    disabled={isRetrying}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isRetrying ? "animate-spin" : ""
                      }`}
                    />
                    {isRetrying ? "Processing..." : "Re-process"}
                  </Button>
                </div>
              )}

              <Separator />

              {/* Delete Project */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-destructive">Delete Project</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently remove this project and all its data. This
                    action cannot be undone.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete Project"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Are you sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the project "{project.name}" and remove all
                        associated commits and data from our servers. The GitHub
                        repository will remain intact.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteProject}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, delete project
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
