// src/components/Sidebar.jsx
import { Link } from 'react-router';

export default function Sidebar() {
  return (
    <aside className="bg-(--theme-background-color) text-(--theme-foreground-color) w-64 h-full p-6">
      <h1 className="text-2xl font-bold">Omni Hub</h1>
      <nav className="flex flex-col space-y-2">
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/">Home</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/student">Student</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/inquiry">Inquiry</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/event">Event</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/user">User</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/product">Product</Link>
      </nav>
    </aside>
  );
}
