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
import { Controller, useForm } from "react-hook-form";

export default function InquiryForm() {
  const { control, handleSubmit, error } = useForm({
    defaultValues: {
      source: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return ( 
    <form onSubmit={handleSubmit(onSubmit)}>
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

              <Controller
                name="source"
                control={control}
                render={({ field }) => {
                  return (
                    <select {...field}>
                      <option value="website">Website</option>
                      <option value="reference">Reference</option>
                      <option value="social">Social Media</option>
                    </select>
                  );
                }}
              />
            </div>

            {/* Name */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Controller
                  name="Name"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="Enter first name" />;
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>

                <Controller
                  name="LastName"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="Enter last name" />;
                  }}
                />
              </div>
            </div>

            {/* Email & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>

                <Controller
                  name="Email"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@mail.com"
                      />
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Controller
                  name="Date"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} type="date" />;
                  }}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              {/* <RadioGroup defaultValue="male" className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" />
                  <Label>Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" />
                  <Label>Female</Label>
                </div>
              </RadioGroup> */}
              <Label className="ml-2">Male</Label>
              <input type="radio" name="gender" value="male" />
              <Label className="ml-2">Female</Label>
              <input type="radio" name="gender" value="female" />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Controller
                name="Mobile"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter mobile number"
                    />
                  );
                }}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Address</Label>
              <Controller
                name="add1"
                control={control}
                render={({ field }) => {
                  return <Input {...field} placeholder="Address Line 1" />;
                }}
              />

              <Controller
                name="add2"
                control={control}
                render={({ field }) => {
                  return <Input {...field} placeholder="Address Line 2" />;
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="City" />;
                  }}
                />
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="State" />;
                  }}
                />
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="Pincode" />;
                  }}
                />
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

                <Controller
                  name="qualification"
                  control={control}
                  render={({ field }) => {
                    return <Input {...field} placeholder="e.g. BSc, BTech" />;
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Controller
                  name="specializations"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input {...field} placeholder="e.g. Computer Science" />
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Passing Year</Label>
                <Controller
                  name="passingYear"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input {...field} type="number" placeholder="2024" />
                    );
                  }}
                />
              </div>
            </div>

            {/* Interested Area */}
            <div className="space-y-2">
              <Label>Interested Area</Label>

              <Controller
                name="specialization"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      placeholder="Web Development, Data Science, etc."
                    />
                  );
                }}
              />
            </div>

            {/* Assign */}
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Controller
                name="counsellor"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select counsellor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c1">Counsellor 1</SelectItem>
                        <SelectItem value="c2">Counsellor 2</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </div>

            <Button className="w-full">Submit Inquiry</Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
