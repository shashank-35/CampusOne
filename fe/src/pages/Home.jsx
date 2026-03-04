import { Link } from "react-router";
import { Users, GraduationCap, Calendar, MessageSquare, Package, BookOpen } from "lucide-react";

export default function Home() {
  // TODO: Add API call to fetch dashboard stats


  const cards = [
    { label: "Total Students", value: "-", icon: GraduationCap, color: "bg-blue-500", link: "/student" },
    { label: "Total Courses", value: "-", icon: BookOpen, color: "bg-green-500", link: "/course" },
    { label: "Upcoming Events", value: "-", icon: Calendar, color: "bg-purple-500", link: "/event" },
    { label: "New Inquiries", value: "-", icon: MessageSquare, color: "bg-orange-500", link: "/inquiry" },
    { label: "Total Products", value: "-", icon: Package, color: "bg-red-500", link: "/product" },
    { label: "Total Users", value: "-", icon: Users, color: "bg-indigo-500", link: "/user" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-2">Welcome to Campus One</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your comprehensive campus management portal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.label} to={card.link}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
