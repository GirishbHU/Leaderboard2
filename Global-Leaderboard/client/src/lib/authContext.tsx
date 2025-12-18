import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: string;
  country: string;
  sector: string;
  currency: string;
  subscriptionStatus: string;
  planType: string;
  leaderboardRank: number;
  percentile: number;
  subscriptionTier: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  subscriptionStatus: string | null;
  isPreviewMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error || "Login failed" };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const user = data?.authenticated ? data.user : null;
  const isAuthenticated = !!data?.authenticated;
  const isAdmin = data?.isAdmin || false;
  const subscriptionStatus = data?.subscriptionStatus || null;
  const isPreviewMode = subscriptionStatus === "active_preview";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        subscriptionStatus,
        isPreviewMode,
        login,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
