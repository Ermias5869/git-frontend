// app/(auth)/layout.tsx
"use client";
import { ReactNode } from "react";
import { LoginNavbar } from "./login/_components/login-navbar";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginNavbar />
      <main>{children}</main>
    </div>
  );
}
