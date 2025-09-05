import { create } from "zustand";
import { baseUrl } from "../api/baseUrl";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
type User = any; // replace with actual user type

type Store = {
  authUser: User | null;
  isCheckingAuth: boolean;
  onlineUsers: any[];

  checkAuth: () => Promise<void>;
  isSigningUp: boolean;
  socket: any;
  isLogin: boolean;
  connectSocket: () => void;
  disconnectSocket: () => void;
  signUp: (data: any) => Promise<void>;
  logIn: (data: any) => Promise<void>;

  logOut: () => Promise<void>;
};

export const useAuthStore = create<Store>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLogin: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await baseUrl.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket();
      console.log("use is logged in", get().socket);
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
      get().connectSocket();
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
      get().disconnectSocket();
    } catch (err) {}
  },
  logIn: async (data: any) => {
    try {
      set({ isLogin: true });
      const res = await baseUrl.post("auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  connectSocket: () => {
    const socket = io("http://localhost:5001", {
      query: {
        userId: get().authUser._id,
      },
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket.connected) {
      get().socket.disconnect();
      console.log("user disconnectd");
    }
  },
}));
