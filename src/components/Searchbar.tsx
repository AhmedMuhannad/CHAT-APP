import { useChatStore } from "../store/useChatStore";
import { useState, useEffect } from "react";

const Searchbar = () => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState(input);

  const { getUserNames, userNames, setUserNames, sendRequest } = useChatStore();

  // Debounce input to avoid firing API on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInput(input);
    }, 300); // 300ms delay

    return () => clearTimeout(timeout);
  }, [input]);

  // Fetch users when debounced input changes
  useEffect(() => {
    if (debouncedInput.trim() !== "") {
      getUserNames(debouncedInput);
    } else {
      setUserNames([]); // clear dropdown
    }
  }, [debouncedInput, getUserNames, setUserNames]);

  return (
    <div className="relative text-[14px] w-[200px]">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search users..."
        className="w-full border border-gray-400 p-2 rounded-md focus:outline-none"
      />

      {userNames.length > 0 && input.trim() !== "" && (
        <div className="absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10">
          {userNames.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              <span>{user.userName}</span>
              <button
                className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md"
                onClick={() => sendRequest(user._id)}
              >
                Invite
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
