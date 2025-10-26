// components/user-profile.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";

export function UserProfile() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      {user.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="w-12 h-12 rounded-full"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{user.username}</h3>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-xs text-gray-500 capitalize">
          {user.plan} • {user.subscriptionStatus.toLowerCase()}
        </p>
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
