import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/UseChatStore.jsx";
import { useAuthStore } from "../store/UseAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

// UserItem Component
const UserItem = ({ user, isSelected, isOnline, onSelect }) => (
  <button
    onClick={() => onSelect(user)}
    aria-label={`Select ${user.fullName}`}
    className={`w-full p-3 flex items-center gap-3 ${
      isSelected ? "bg-base-300 ring-1 ring-base-300" : "hover:bg-base-300"
    }`}
  >
    <div className="relative mx-auto lg:mx-0">
      <img
        loading="lazy"
        src={user.profilePic || "/avatar.png"}
        alt={user.fullName}
        className="size-12 object-cover rounded-full"
      />
      {isOnline && (
        <span
          className="absolute bottom-0 right-0 size-3 bg-green-500 
          rounded-full ring-2 ring-zinc-900"
        />
      )}
    </div>
    <div className="hidden lg:block text-left min-w-0">
      <div className="font-medium truncate">{user.fullName}</div>
      <div className="text-sm text-zinc-400">{isOnline ? "Online" : "Offline"}</div>
    </div>
  </button>
);

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on online status and search query
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (showOnlineOnly ? onlineUsers.includes(user._id) : true)
    );
  }, [users, searchQuery, showOnlineOnly, onlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search contacts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-sm w-full mt-3 hidden lg:block"
        />

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <UserItem
            key={user._id}
            user={user}
            isSelected={selectedUser?._id === user._id}
            isOnline={onlineUsers.includes(user._id)}
            onSelect={setSelectedUser}
          />
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
