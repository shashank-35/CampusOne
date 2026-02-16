import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Controller, useForm } from "react-hook-form";

export default function LoginFormPrac() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = (data) => {
    console.log("🚀 Login Data:", data);
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
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            {/* Email */}
            <div className="group">
              <Label className="group-hover:text-black">Email Address</Label>

              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="example@email.com"
                    className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  />
                )}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="group">
              <Label className="group-hover:text-black">Password</Label>

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  />
                )}
              />

              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="cursor-pointer">
                  Remember me
                </Label>
              </div>

              <button type="button" className="text-gray-600 hover:text-black">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="outline"
              className="w-full h-11 text-base
                         border-gray-300
                         hover:bg-gray-900
                         hover:text-white
                         hover:border-gray-900"
            >
              Login
            </Button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span className="text-black cursor-pointer hover:underline">
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
