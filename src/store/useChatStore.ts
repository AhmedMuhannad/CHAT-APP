import { create } from "zustand";
import toast from "react-hot-toast";
import { baseUrl } from "../api/baseUrl";
import { useAuthStore } from "./useAuthStore";
type Store = {
  messages: any[];
  users: any[];
  selectedUser: any;
  getUsers: () => Promise<any>;
  isMessageLoading: boolean;
  isUsersLoading: boolean;
  getMessages: (userId: String) => Promise<any>;
  isSelectedUser: boolean;
  setSelectedUser: (selectedUser: any) => void;
  sendMessage: (message: any) => Promise<any>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
};
export const useChatStore = create<Store>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,
  isSelectedUser: false,
  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await baseUrl.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId: String) => {
    try {
      set({ isMessageLoading: true });
      const res = await baseUrl.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
    } finally {
      set({ isMessageLoading: false });
    }
  },
  setSelectedUser: (selectedUser: any) => {
    set({ selectedUser });
  },
  sendMessage: async (messageData: any) => {
    const { selectedUser, messages } = get();
    try {
      const res = await baseUrl.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.newMessage] });
    } catch (err) {}
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    console.log("selected is?: ", selectedUser);

    if (!selectedUser) return;
    console.log("then work");
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage: any) => {
      console.log("new message: ", newMessage);

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
