// app/notifications/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/notifications`,
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
        setNotifications(result.data);
      } else {
        setError(result.error || "Failed to fetch notifications");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
      console.error("Notifications fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationVariant = (type: string) => {
    const variants = {
      info: "default",
      success: "default",
      warning: "secondary",
      error: "destructive",
    };
    return variants[type as keyof typeof variants] as
      | "default"
      | "secondary"
      | "destructive";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <p className="font-semibold">Error loading notifications</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <Button onClick={fetchNotifications}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Notifications
              </CardTitle>
              <CardDescription>
                Your recent notifications and alerts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You&rsquo;re all caught up! New notifications will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                      !notification.read && "bg-muted/50"
                    )}
                  >
                    <div className="text-2xl"></div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">
                              {notification.title}
                            </h4>
                            <Badge
                              variant={getNotificationVariant(
                                notification.type
                              )}
                              className="text-xs"
                            >
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <Badge
                                variant="default"
                                className="bg-blue-500 text-xs"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={notification.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
