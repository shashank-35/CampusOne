import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function InquiryForm() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl bg-white shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Inquiry Form
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Source of Inquiry */}
          <div className="space-y-2">
            <Label>Source of Inquiry</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input placeholder="Enter last name" />
            </div>
          </div>

          {/* Email & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="example@mail.com" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup defaultValue="male" className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" />
                <Label>Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" />
                <Label>Female</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input type="tel" placeholder="Enter mobile number" />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Address</Label>
            <Input placeholder="Address Line 1" />
            <Input placeholder="Address Line 2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="City" />
              <Input placeholder="State" />
              <Input placeholder="Pincode" />
            </div>
          </div>

          {/* Tech Background */}
          <div className="space-y-2">
            <Label>Tech Background</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="non-tech">Non Tech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Education */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Input placeholder="e.g. BSc, BTech" />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input placeholder="e.g. Computer Science" />
            </div>
            <div className="space-y-2">
              <Label>Passing Year</Label>
              <Input type="number" placeholder="2024" />
            </div>
          </div>

          {/* Interested Area */}
          <div className="space-y-2">
            <Label>Interested Area</Label>
            <Input placeholder="Web Development, Data Science, etc." />
          </div>

          {/* Assign */}
          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select counsellor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Counsellor 1</SelectItem>
                <SelectItem value="c2">Counsellor 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">
            Submit Inquiry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
