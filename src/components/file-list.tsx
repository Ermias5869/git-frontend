"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectGrid() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects from API...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
          {
            method: "GET",
            credentials: "include", // send cookies for JWT auth
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
      }
    };

    fetchProjects();
  }, []);

  if (error)
    return (
      <div className="p-6 text-red-500 text-center font-semibold">{error}</div>
    );
  console.log("Rendering projects:", projects);

  return (
    <div className="min-h-screen  p-8">
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
              className="flex flex-col items-center justify-center p-4  hover:bg-foreground/10 rounded-lg transition-colors duration-200"
            >
              <Image
                src="/folder-1.png"
                alt="Folder"
                width={150}
                height={150}
                className="mb-2"
              />
              <p className="text-sm font-medium text-foreground text-center truncate w-full">
                {project.name}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
