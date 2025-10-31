// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Mail, Github, Crown, RefreshCw } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  githubId: string;
  avatarUrl: string;
  plan: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error || "Failed to fetch profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <p className="font-semibold">Error loading profile</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <Button onClick={fetchProfile}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatarUrl} alt={profile?.username} />
                <AvatarFallback>
                  {profile?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{profile?.username}</CardTitle>
            <CardDescription>GitHub Developer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant={profile?.plan === "premium" ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {profile?.plan === "premium" && <Crown className="h-3 w-3" />}
                {profile?.plan}
              </Badge>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Username
                </label>
                <div className="flex items-center gap-2 p-2 rounded-md border">
                  <Github className="h-4 w-4" />
                  <span>{profile?.username}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <div className="flex items-center gap-2 p-2 rounded-md border">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email || "Not provided"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  GitHub ID
                </label>
                <div className="p-2 rounded-md border">
                  <span className="font-mono text-sm">{profile?.githubId}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Member Since
                </label>
                <div className="flex items-center gap-2 p-2 rounded-md border">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {profile
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
