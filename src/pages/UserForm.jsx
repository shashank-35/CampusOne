import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export  function UserForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
      <Card className="w-full max-w-2xl border-black">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            User Registration Form
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input placeholder="Enter first name" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input placeholder="Enter last name" />
            </div>
          </div>

          {/* Email & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Enter email" />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" />
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label>Gender</Label>
            <RadioGroup className="flex gap-6 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Mobile */}
          <div>
            <Label>Mobile Number</Label>
            <Input type="tel" placeholder="Enter mobile number" />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <Label className="text-lg">Address</Label>
            <Input placeholder="Address Line 1" />
            <Input placeholder="Address Line 2" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="City" />
              <Input placeholder="State" />
              <Input placeholder="Pincode" />
            </div>
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
