import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StudentHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
            Welcome, {user?.firstName}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">Student dashboard coming soon.</p>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-11 text-base
                     border-gray-300
                     hover:bg-gray-900
                     hover:text-white
                     hover:border-gray-900"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
