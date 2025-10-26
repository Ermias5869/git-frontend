// hooks/use-auth.ts
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout,
    checkAuth,
    initializeFromRedirect,
  } = useAuthStore();

  useEffect(() => {
    // Initial auth check on app load
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout,
    checkAuth,
    initializeFromRedirect,
  };
};
