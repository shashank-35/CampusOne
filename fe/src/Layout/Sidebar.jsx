import { Link, useNavigate } from 'react-router';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="bg-(--theme-background-color) text-(--theme-foreground-color) w-64 h-full p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">OmniHub</h1>
      <nav className="flex flex-col space-y-2 flex-1">
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/">Home</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/student">Student</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/inquiry">Inquiry</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/course">Course</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/event">Event</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/user">User</Link>
        <Link className="block px-2 py-1 rounded hover:bg-gray-700" to="/product">Product</Link>
      </nav>
      {user && (
        <div className="mt-auto pt-4 border-t border-gray-600">
          <p className="text-sm text-gray-400 mb-2">{user.firstName} {user.lastName}</p>
          <button
            onClick={logout}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-700 text-red-400 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
