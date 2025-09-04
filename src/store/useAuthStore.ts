import { create } from "zustand";
import { baseUrl } from "../api/baseUrl";
import toast from "react-hot-toast";

type User = any; // replace with actual user type

type Store = {
  authUser: User | null;
  isCheckingAuth: boolean;
  onlineUsers: any[];

  checkAuth: () => Promise<void>;
  isSigningUp: boolean;
  isLogin: boolean;
  signUp: (data: any) => Promise<void>;
  logIn: (data: any) => Promise<void>;

  logOut: () => Promise<void>;
};

export const useAuthStore = create<Store>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogin: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await baseUrl.get("/auth/check-auth");
      set({ authUser: res.data });
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data: any) => {
    set({ isSigningUp: true });
    try {
      const res = await baseUrl.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  logOut: async () => {
    try {
      await baseUrl.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (err) {}
  },
  logIn: async (data: any) => {
    try {
      set({ isLogin: true });
      const res = await baseUrl.post("auth/login", data);
      set({ authUser: res.data });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
