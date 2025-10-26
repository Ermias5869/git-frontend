// app/dashboard/page.tsx
"use client";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateProjectDialog } from "@/components/create-project-dialog";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
          </div>
          <CreateProjectDialog />
        </div>
      </div>
    </div>
  );
}
