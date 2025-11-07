"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "./ui/spinner";

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
  status: "created" | "pending" | "processed" | "failed";
  userId: string;
  createdAt: string;
  updatedAt: string;
  processingLockedUntil?: string;
  processingStartedAt?: string;
  processingEndedAt?: string;
  errorMessage?: string;
}

// Status icon component
const StatusIcon = ({ status }: { status: Project["status"] }) => {
  const getStatusConfig = (status: Project["status"]) => {
    switch (status) {
      case "created":
        return {
          icon: "🟡",
          tooltip: "Repo Created - Ready to process",
          color: "text-foreground",
        };
      case "pending":
        return {
          icon: "⏳",
          tooltip: "Processing in progress",
          color: "text-foreground",
        };
      case "processed":
        return {
          icon: "✅",
          tooltip: "Successfully processed",
          color: "text-foreground",
        };
      case "failed":
        return {
          icon: "❌",
          tooltip: "Processing failed",
          color: "text-red-500",
        };
      default:
        return {
          icon: "⚪",
          tooltip: "Unknown status",
          color: "text-gray-500",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 text-sm ${config.color}`}
      title={config.tooltip}
    >
      {config.icon}
    </span>
  );
};

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log("Fetching projects from API...");
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

        console.log("📡 API Response status:", response.status);

        const result = await response.json();
        console.log("✅ API Response data:", result);

        if (result.success) {
          setProjects(result.data);
        } else {
          setError(result.error || "Failed to fetch projects");
        }
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
        setError("Error fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">{error}</div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {projects.length === 0 ? (
          <p className="col-span-4 text-gray-500 text-center">
            No projects found.
          </p>
        ) : (
          projects.map((project) => (
            <Link
              href={`/dashboard/projects/${project.id}`}
              key={project.id}
              className="flex flex-col items-center justify-center p-4 hover:bg-foreground/10 rounded-lg transition-colors duration-200 relative group"
            >
              {/* Status badge in top corner */}
              <div className="absolute top-2 right-2">
                <StatusIcon status={project.status} />
              </div>

              <Image
                src="/folder-1.png"
                alt="Folder"
                width={150}
                height={150}
                className="mb-2"
              />

              {/* Project name with status icon */}
              <div className="flex items-center justify-center gap-1 w-full">
                <StatusIcon status={project.status} />
                <p className="text-sm font-medium text-foreground text-center truncate flex-1">
                  {project.name}
                </p>
              </div>

              {/* Status text below name */}
              <p
                className={`text-xs mt-1 ${
                  project.status === "processed"
                    ? "text-green-600"
                    : project.status === "failed"
                    ? "text-red-600"
                    : project.status === "pending"
                    ? "text-blue-600"
                    : "text-yellow-600"
                }`}
              >
                {project.status.charAt(0).toUpperCase() +
                  project.status.slice(1)}
              </p>

              {/* Error message tooltip for failed projects */}
              {project.status === "failed" && project.errorMessage && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-800 text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-lg">
                  Error: {project.errorMessage}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
