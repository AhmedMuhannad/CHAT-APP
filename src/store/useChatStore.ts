import { create } from "zustand";
import toast from "react-hot-toast";
import { baseUrl } from "../api/baseUrl";
type Store = {
  messages: String[];
  users: any[];
  selectedUser: any;
  getUsers: () => Promise<any>;
  isMessageLoading: boolean;
  isUsersLoading: boolean;
  isSelectedUser: boolean;
  setSelectedUser: (selectedUser: any) => void;
};
export const useChatStore = create<Store>((set) => ({
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
}));
