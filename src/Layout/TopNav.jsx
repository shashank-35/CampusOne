// src/components/TopNav.jsx
import { Bell, User } from "lucide-react";

export default function TopNav() {
  return (
    <header className="flex rounded-2xl bg-(--theme-background-color) text-(--theme-foreground-color) justify-between items-center p-4 shadow">
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring"
        />
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification icon */}
        <Bell className="h-6 w-6 " />
        {/* User/profile icon */}
        <User className="h-6 w-6 " />
      </div>
    </header>
  );
}
