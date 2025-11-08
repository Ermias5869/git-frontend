// components/data-table.tsx
"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconGitBranch,
  IconCalendar,
  IconCheck,
  IconX,
  IconClock,
  IconHelp,
  IconUpload,
  IconRefresh,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface DataTableProps {
  dashboardData?: {
    recentProjects: Array<{
      id: string;
      name: string;
      status: string;
      createdAt: string;
      commitCount: number;
      lastCommit: string | null;
      lastCommitDate: string | null;
    }>;
  } | null;
}

export function DataTable({ dashboardData }: DataTableProps) {
  const projects = dashboardData?.recentProjects || [];
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Status explanations for hover cards
  const statusExplanations = {
    created: {
      title: "Repository Created",
      description:
        "GitHub repository was created successfully. Ready for file upload.",
      icon: IconCheck,
      color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      action: "Upload your project files to continue",
    },
    pending: {
      title: "Processing",
      description:
        "Project is currently being processed. This may take a few minutes.",
      icon: IconClock,
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      action: "Processing in progress...",
    },
    processed: {
      title: "Completed",
      description:
        "Project has been successfully processed and all commits are generated.",
      icon: IconCheck,
      color: "bg-green-100 text-green-800 hover:bg-green-100",
      action: "Ready for use",
    },
    failed: {
      title: "Failed",
      description:
        "Something went wrong during processing. Check project details for errors.",
      icon: IconX,
      color: "bg-red-100 text-red-800 hover:bg-red-100",
      action: "Go to project details to retry",
    },
    processing: {
      title: "In Progress",
      description:
        "Project is actively being processed. Please wait for completion.",
      icon: IconClock,
      color: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      action: "Processing...",
    },
  };

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    return (
      statusExplanations[
        normalizedStatus as keyof typeof statusExplanations
      ] || {
        title: status,
        description: "Unknown status",
        icon: IconHelp,
        color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        action: "Check project details",
      }
    );
  };

  const StatusHoverCard = ({
    status,
    children,
  }: {
    status: string;
    children: React.ReactNode;
  }) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
      <HoverCard>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between items-start space-x-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" />
                <h4 className="text-sm font-semibold">{config.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
              <div className="flex items-center pt-2">
                <IconHelp className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {config.action}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
      <Badge className={config.color}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {config.title}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUploadClick = (projectId: string, projectName: string) => {
    console.log("Upload files for project:", projectId, projectName);
    setSelectedProjectId(projectId);
    setIsUploadDialogOpen(true);
  };

  const handleRetryProject = async (projectId: string, projectName: string) => {
    try {
      console.log("Retrying project:", projectId, projectName);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/retry`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Project queued for retry! Status will update shortly.");
        // Refresh the page after a short delay to show updated status
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(result.error || "Failed to retry project");
      }
    } catch (error) {
      console.error("Retry error:", error);
      toast.error("Failed to retry project - please try again");
    }
  };

  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    setSelectedProjectId(null);
    // Refresh the page after upload to show updated project status
    setTimeout(() => window.location.reload(), 2000);
  };

  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Status
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-4 w-4">
                          <IconHelp className="h-3 w-3" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">
                            Project Status Guide
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                Created
                              </Badge>
                              <span>Repo created, need file upload</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Pending
                              </Badge>
                              <span>Waiting for processing</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-orange-100 text-orange-800">
                                Processing
                              </Badge>
                              <span>Currently being processed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800">
                                Processed
                              </Badge>
                              <span>Successfully completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">Failed</Badge>
                              <span>Error occurred, needs retry</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </TableHead>
                <TableHead>Commits</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {project.name}
                        {project.status.toLowerCase() === "created" && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  handleUploadClick(project.id, project.name)
                                }
                              >
                                <IconUpload className="h-3 w-3 text-blue-500" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="text-sm space-y-2">
                                <p className="font-medium">
                                  Upload Project Files
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Click to upload your ZIP file and complete
                                  project setup
                                </p>
                                <Button
                                  size="sm"
                                  className="w-full mt-2"
                                  onClick={() =>
                                    handleUploadClick(project.id, project.name)
                                  }
                                >
                                  <IconUpload className="h-3 w-3 mr-1" />
                                  Upload Files
                                </Button>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusHoverCard status={project.status}>
                        <div className="cursor-help">
                          {getStatusBadge(project.status)}
                        </div>
                      </StatusHoverCard>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconGitBranch className="h-3 w-3 text-muted-foreground" />
                        <span>{project.commitCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {project.lastCommitDate ? (
                        <div className="flex items-center gap-1">
                          <IconCalendar className="h-3 w-3 text-muted-foreground" />
                          <span>{formatDate(project.lastCommitDate)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No activity
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconCalendar className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/projects/${project.id}`}>
                            View
                          </Link>
                        </Button>
                        {project.status.toLowerCase() === "failed" && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRetryProject(project.id, project.name)
                                }
                              >
                                <IconRefresh className="h-3 w-3" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="text-sm">
                                <p>Retry this project processing</p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <IconGitBranch className="h-8 w-8 text-muted-foreground" />
                      <div className="text-muted-foreground">
                        No projects found
                      </div>
                      <CreateProjectDialog />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Upload Dialog for Step 2 */}
      {selectedProjectId && (
        <UploadProjectDialog
          projectId={selectedProjectId}
          projectName={
            projects.find((p) => p.id === selectedProjectId)?.name || ""
          }
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onComplete={handleUploadComplete}
        />
      )}
    </>
  );
}
// components/data-table.tsx (updated UploadProjectDialog component)
function UploadProjectDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
  onComplete,
}: {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [desiredCommitCount, setDesiredCommitCount] = useState(10);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedMimeTypes = [
        "application/zip",
        "application/x-zip",
        "application/x-zip-compressed",
        "application/octet-stream",
      ];

      const isZipByMimeType = allowedMimeTypes.includes(file.type);
      const isZipByExtension = file.name.toLowerCase().endsWith(".zip");

      if (isZipByMimeType || isZipByExtension) {
        setSelectedFile(file);
        toast.success("ZIP file selected successfully!");
      } else {
        toast.error("Please select a valid ZIP file");
        e.target.value = "";
        setSelectedFile(null);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    // Validate dates
    if (startDate && endDate && startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Add date and commit count to form data
      if (startDate) {
        formData.append("startDate", startDate.toISOString());
      }
      if (endDate) {
        formData.append("endDate", endDate.toISOString());
      }
      if (desiredCommitCount) {
        formData.append("desiredCommitCount", desiredCommitCount.toString());
      }

      console.log("📋 Upload FormData:", {
        projectId,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        desiredCommitCount,
        fileName: selectedFile.name,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/file/upload/${projectId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success(
            "File uploaded successfully! Project is now being processed."
          );
          onComplete();
        } else {
          toast.error(result.error || "Upload failed");
        }
      } else {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        toast.error("Upload failed - please try again");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed - check console for details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Project Setup - {projectName}</DialogTitle>
          <DialogDescription>
            Step 2: Upload files and configure commit timeline
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-3">
            <Label
              htmlFor="project-file-upload"
              className="text-base font-medium"
            >
              Project Files (ZIP) *
            </Label>
            <div className="border-2  border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Input
                type="file"
                accept=".zip,application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream"
                onChange={handleFileChange}
                className="hidden"
                id="project-file-upload"
              />
              <label
                htmlFor="project-file-upload"
                className="cursor-pointer block"
              >
                {selectedFile ? (
                  <div className="text-green-600">
                    <IconCheck className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <>
                    <IconUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">
                      Click to upload ZIP file
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, "PPP")
                        : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Desired Commit Count */}
            <div className="space-y-2">
              <Label htmlFor="commit-count">Desired Commit Count *</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="commit-count"
                  type="number"
                  min="1"
                  max="1000"
                  value={desiredCommitCount}
                  onChange={(e) =>
                    setDesiredCommitCount(Number(e.target.value))
                  }
                  className="flex-1"
                />
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDesiredCommitCount(10)}
                  >
                    10
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDesiredCommitCount(25)}
                  >
                    25
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDesiredCommitCount(50)}
                  >
                    50
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading || desiredCommitCount < 1}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>Complete Setup</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// You'll need to import these additional components
