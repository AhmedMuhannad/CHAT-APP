import React, { useEffect } from "react";
import { ContactRound } from "lucide-react";
import FriendRequest from "./FriendRequest";
import { useChatStore } from "../store/useChatStore";

const Drawer = () => {
  const { getFriendRequests, friendsRequests } = useChatStore();
  useEffect(() => {
    getFriendRequests();
  }, []);
  console.log("friend request: ", friendsRequests);
  return (
    <div className="drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer-4" className="drawer-button btn btn-sm ">
          <ContactRound className="" />
          <p>Friend Request</p>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <h1>Friend Requests</h1>
          <hr className="border-t border-gray-300 my-4 " />
          <FriendRequest />
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
