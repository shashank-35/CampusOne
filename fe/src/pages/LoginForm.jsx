import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // const res = await axios.post(`${API}/auth/login`, {
      //   email: email,
      //   password: password,
      // });
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });
      console.log("🚀 ~ submitHandler ~ res:", res.data);
      const { user, token } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res));
      if (user.role === "student") {
        navigate("/student-home");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log("🚀 ~ submitHandler ~ err:", err.response.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <div className="group">
              <Label className="group-hover:text-black">Email Address</Label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="group">
              <Label className="group-hover:text-black">Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="outline"
              className="w-full h-11 text-base mt-4
                       border-gray-300
                       hover:bg-gray-900
                       hover:text-white
                       hover:border-gray-900
                       disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
