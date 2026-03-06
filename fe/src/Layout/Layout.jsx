import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="w-64 flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
