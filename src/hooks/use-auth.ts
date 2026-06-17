"use client";

import { create } from "zustand";
import type { User } from "@/types";
import { authAPI, usersAPI } from "@/lib/api";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  loginWidget: (data: object) => Promise<void>;
  loginMiniApp: (initData: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    const token = localStorage.getItem("tl_token");
    if (!token) {
      set({ isHydrated: true });
      return;
    }
    set({ token, isLoading: true });
    try {
      const user = await usersAPI.getMe();
      set({ user, token, isLoading: false, isHydrated: true });
    } catch {
      localStorage.removeItem("tl_token");
      set({ user: null, token: null, isLoading: false, isHydrated: true });
    }
  },

  loginWidget: async (data: object) => {
    set({ isLoading: true });
    try {
      const { token, user } = await authAPI.loginWidget(data);
      localStorage.setItem("tl_token", token);
      set({ token, user, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  loginMiniApp: async (initData: string) => {
    set({ isLoading: true });
    try {
      const { token, user } = await authAPI.loginMiniApp(initData);
      localStorage.setItem("tl_token", token);
      set({ token, user, isLoading: false, isHydrated: true });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("tl_token");
    set({ user: null, token: null });
  },
}));
