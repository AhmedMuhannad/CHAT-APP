import React from "react";
import { useChatStore } from "../store/useChatStore";

const FriendRequest = () => {
  const { friendsRequests, getFriendRequests, acceptFriend } = useChatStore();
  console.log("what is :", friendsRequests);
  return (
    <div>
      <div className="flex  gap-4">
        <div className="size-24 bg-amber-200" />
        <div className="flex flex-col justify-around">
          {friendsRequests.length > 0 &&
            friendsRequests.map((request) => (
              <>
                {" "}
                <h1>{request.from.userName}</h1>
                <h1>{request.from.email}</h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      acceptFriend(request.from._id);
                      getFriendRequests();
                    }}
                    className="border bg-amber-300 px-2 rounded-sm"
                  >
                    Accept
                  </button>
                  <button className="border bg-amber-300 px-2 rounded-sm">
                    Reject
                  </button>
                </div>
              </>
            ))}
        </div>
      </div>
      <hr className="border-t border-gray-200 my-4 " />
    </div>
  );
};

export default FriendRequest;
