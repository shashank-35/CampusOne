import React from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";


// props destructuring 
export default function Layout({ children }) {
  return (
    <div className="flex flex-1">
      <div className="min-h-screen bg-red-500 ">
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="max-h-[90px] p-2.5">
          <TopNav />
        </div>
        <div className="h-[calc(100vh-90px)] bg-gray-500 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
