import { create } from "zustand";
import toast from "react-hot-toast";
import { baseUrl } from "../api/baseUrl";
import { useAuthStore } from "./useAuthStore";
type Store = {
  messages: any[];
  friends: any[];
  users: any[];
  userNames: any[];
  friendsRequests: any[];
  getUserNames: (search: string) => Promise<any>;
  setUserNames: (arr: any[]) => void;
  selectedUser: any;
  getUsers: () => Promise<any>;
  isMessageLoading: boolean;
  isUsersLoading: boolean;
  getMessages: (userId: string) => Promise<any>;
  isSelectedUser: boolean;
  setSelectedUser: (selectedUser: any) => void;
  sendMessage: (message: any) => Promise<any>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  sendRequest: (id: string) => void;
  getFriendRequests: () => Promise<any>;
  acceptFriend: (id: string) => void;
  getFriends: () => void;
  subscribeToFriends: () => void;
  unsubscribeFromFriends: () => void;
};
export const useChatStore = create<Store>((set, get) => ({
  messages: [],
  friends: [],
  users: [],
  userNames: [],
  friendsRequests: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,
  isSelectedUser: false,
  setUserNames: (arr: any[]) => {
    set({ userNames: arr });
  },
  getUsers: async () => {
    //this is for fetching users
    try {
      set({ isUsersLoading: true });
      const res = await baseUrl.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId: string) => {
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
    } catch (err) {
      throw err;
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    // console.log("selected is?: ", selectedUser);

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
  getUserNames: async (search: string) => {
    // console.log("search: ", search);
    try {
      const res = await baseUrl.post("auth/search-users", {
        search,
      });
      console.log("get user naems:", res);
      set({ userNames: res.data.filteredUsers });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  sendRequest: async (id: string) => {
    try {
      await baseUrl.post(`auth/send-request/${id}`);
      console.log("request have been sent");
    } catch (err) {
      throw err;
    }
  },
  getFriendRequests: async () => {
    try {
      const res = await baseUrl.get("auth/get-friends-request/");
      set({ friendsRequests: res.data.friends });
      console.log("hi", res.data.friends);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // acceptFriend: async (id: string) => {
  //   try {
  //     const res = await baseUrl.post(`auth/accept-request/${id}`);
  //     console.log(res);
  //   } catch (errrr) {
  //     throw errrr;
  //   }
  // },
  // in useChatStore.js

  acceptFriend: async (id: string) => {
    const { friendsRequests } = get(); // Get the current requests
    try {
      await baseUrl.post(`auth/accept-request/${id}`);

      // Update the state immediately after the request is successful
      set({
        friendsRequests: friendsRequests.filter(
          (request) => request.from._id !== id
        ),
      });
      toast.success("Friend request accepted!");
    } catch (err) {
      toast.error("Failed to accept friend request.");
      throw err;
    }
  },

  getFriends: async () => {
    try {
      const res = await baseUrl.get("auth/show-friends");
      set({ friends: res.data.friends });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  subscribeToFriends: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // We define the handler here, so it's the same function instance.
    const friendAddedHandler = (newFriend: any) => {
      console.log("new friend received:", newFriend);
      set((state) => ({
        friends: [...state.friends, newFriend],
      }));
    };

    // The `off` and `on` should be in the `useEffect` itself for proper cleanup.
    // The handler is passed as a named function, not an arrow function.
    socket.on("friendAdded", friendAddedHandler);

    // This is not part of the `subscribe` method itself, but rather the `useEffect` cleanup.
    // We'll fix the `useEffect` next to handle this properly.
  },
  unsubscribeFromFriends: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("friendAdded");
  },
}));
