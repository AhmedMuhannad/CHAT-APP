import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore"; // Import useAuthStore

const FriendRequest = () => {
  const {
    friendsRequests,
    getFriendRequests,
    acceptFriend,
    subscribeToFriends,
    unsubscribeFromFriends,
  } = useChatStore();
  console.log("your request is:", friendsRequests);
  const socket = useAuthStore((state) => state.socket);
  const friendAddedHandler = (newFriend: any) => {
    useChatStore.setState((state) => ({
      friends: [...state.friends, newFriend],
    }));
  };

  useEffect(() => {
    getFriendRequests();

    if (socket) {
      // Attach the listener
      socket.on("friendAdded", friendAddedHandler);
    }

    // Return the cleanup function
    return () => {
      if (socket) {
        socket.off("friendAdded", friendAddedHandler);
      }
    };
  }, [socket, getFriendRequests]); // Depend on socket and getFriendRequests

  return (
    <div>
      <div className="flex  gap-4">
        {/* <div className="size-24 bg-amber-200" /> */}
        <div className="flex flex-col justify-around">
          {friendsRequests.length >= 0 &&
            friendsRequests.map((request) => (
              <>
                {" "}
                <h1>{request.from.userName}</h1>
                <h1>{request.from.email}</h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      acceptFriend(request.from._id); // This now handles the state update
                    }}
                    className="border bg-amber-300 px-2 rounded-sm"
                  >
                    Accept
                  </button>
                  <button className="border bg-amber-300 px-2 rounded-sm">
                    Reject
                  </button>{" "}
                  <hr className="border-t border-gray-200 my-4 " />
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
