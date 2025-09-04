import { create } from "zustand";
import toast from "react-hot-toast";
import { baseUrl } from "../api/baseUrl";
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
      set({ messages: [res.data] });
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
      console.log("messsage is", res);
      console.log("your message is: ", res);
      set({ messages: [...messages, res.data] });
    } catch (err) {}
  },
}));
