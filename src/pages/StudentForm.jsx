import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";

export default function StudentForm() {
  const [educationList, setEducationList] = useState([
    { qualification: "", stream: "", year: "" },
  ]);

  const addEducation = () => {
    setEducationList([
      ...educationList,
      { qualification: "", stream: "", year: "" },
    ]);
  };

  const removeEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <Card className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
            Student Registration Form
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* BASIC INFO */}
          <section className="space-y-5">
            <h3 className="text-lg font-medium text-gray-700">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <Label className="group-hover:text-black">First Name</Label>
                <Input
                  placeholder="Enter first name"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="group">
                <Label className="group-hover:text-black">Last Name</Label>
                <Input
                  placeholder="Enter last name"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="group">
                <Label className="group-hover:text-black">Email</Label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="group">
                <Label className="group-hover:text-black">Date of Birth</Label>
                <Input
                  type="date"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" />
                  <Label>Male</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" />
                  <Label>Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="group">
              <Label className="group-hover:text-black">Mobile Number</Label>
              <Input
                placeholder="10 digit mobile number"
                className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </section>

          {/* ADDRESS */}
          <section className="space-y-5">
            <h3 className="text-lg font-medium text-gray-700">Address</h3>

            <div className="p-5 border border-gray-200 rounded-md bg-gray-50 hover:bg-white hover:shadow-sm space-y-4">
              <Input
                placeholder="House No, Street, Area"
                className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
              <Input
                placeholder="Landmark (optional)"
                className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="City"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
                <Input
                  placeholder="State"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
                <Input
                  placeholder="Pincode"
                  maxLength={6}
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </section>

          {/* BACKGROUND */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              Technical Background
            </h3>

            <Select>
              <SelectTrigger className="hover:border-gray-400 focus:border-black">
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="non-tech">Non Tech</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* EDUCATION */}
          <section className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Education</h3>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addEducation}
                className="hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {educationList.map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 bg-gray-50 hover:bg-white hover:shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Education {index + 1}</p>

                  {educationList.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                      className="hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="Qualification"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
                <Input
                  placeholder="Specialization / Stream"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
                <Input
                  placeholder="Passing Year"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            ))}
          </section>

          {/* PARENT */}
          <section className="space-y-5">
            <h3 className="text-lg font-medium text-gray-700">
              Parent Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                placeholder="Parent Name"
                className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
              <Input
                placeholder="Parent Phone Number"
                className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </section>

          {/* SUBMIT */}
          <div className="pt-4">
           <Button
  type="submit"
  variant="outline"
  className="w-full h-11 text-base
             border-gray-300
             hover:bg-gray-900
             hover:text-white
             hover:border-gray-900"
>
  Submit Form
</Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
