// stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  githubId: string;
  avatarUrl: string;
  plan: string;
  subscriptionStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initializeFromRedirect: (userData: User) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("auth-storage");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // stores/auth-store.ts - Add logging
      checkAuth: () => {
        try {
          const storedUser = localStorage.getItem("user");
          console.log("🔍 checkAuth - storedUser exists:", !!storedUser);

          if (storedUser) {
            const userData = JSON.parse(storedUser);
            console.log("✅ checkAuth - User data found:", userData.username);
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.log("❌ checkAuth - No user data found");
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      initializeFromRedirect: (userData: User) => {
        console.log(
          "🚀 initializeFromRedirect - Setting user:",
          userData.username
        );
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
