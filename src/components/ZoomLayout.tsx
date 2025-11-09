// components/ZoomLayout.tsx
"use client";

import { useEffect } from "react";

export default function ZoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Only prevent zoom gestures, don't force zoom
    const preventZoom = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("gesturestart", preventZoom);
    document.addEventListener("gesturechange", preventZoom);
    document.addEventListener("gestureend", preventZoom);

    return () => {
      document.removeEventListener("gesturestart", preventZoom);
      document.removeEventListener("gesturechange", preventZoom);
      document.removeEventListener("gestureend", preventZoom);
    };
  }, []);

  return <div className="zoom-container">{children}</div>;
}
