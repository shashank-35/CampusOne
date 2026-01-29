<<<<<<< HEAD
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
=======
import { useState } from "react";

export default function InquiryForm() {
  const [inquiry, setInquiry] = useState({
    sourceOfInquiry: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "male",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    techBackground: "",
    qualification: "",
    specialization: "",
    passingYear: "",
    interestedArea: "",
    assignTo: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inquiry);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-md border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Inquiry Form
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Source of Inquiry */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Source of Inquiry</label>
              <select 
                value={inquiry.sourceOfInquiry}
                onChange={(e) => setInquiry({ ...inquiry, sourceOfInquiry: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select source</option>
                <option value="website">Website</option>
                <option value="reference">Reference</option>
                <option value="social">Social Media</option>
              </select>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input 
                  type="text"
                  value={inquiry.firstName}
                  onChange={(e) => setInquiry({ ...inquiry, firstName: e.target.value })}
                  placeholder="Enter first name" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text"
                  value={inquiry.lastName}
                  onChange={(e) => setInquiry({ ...inquiry, lastName: e.target.value })}
                  placeholder="Enter last name" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
                />
              </div>
            </div>

            {/* Email & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
<<<<<<< HEAD
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
=======
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  value={inquiry.email}
                  onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                  placeholder="example@mail.com" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input 
                  type="date" 
                  value={inquiry.dateOfBirth}
                  onChange={(e) => setInquiry({ ...inquiry, dateOfBirth: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="male" 
                    name="gender" 
                    value="male" 
                    checked={inquiry.gender === "male"}
                    onChange={(e) => setInquiry({ ...inquiry, gender: e.target.value })}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="male" className="text-sm font-medium text-gray-700">Male</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="female" 
                    name="gender" 
                    value="female"
                    checked={inquiry.gender === "female"}
                    onChange={(e) => setInquiry({ ...inquiry, gender: e.target.value })}
                    className="h-4 w-4 border-gray-300 text-blue-800 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="female" className="text-sm font-medium text-gray-700">Female</label>
                </div>
              </div>
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
            </div>

            {/* Mobile */}
            <div className="space-y-2">
<<<<<<< HEAD
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
=======
              <label className="text-sm font-medium text-gray-700">Mobile Number</label>
              <input 
                type="tel" 
                value={inquiry.mobile}
                onChange={(e) => setInquiry({ ...inquiry, mobile: e.target.value })}
                placeholder="Enter mobile number" 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
<<<<<<< HEAD
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
=======
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input 
                type="text"
                value={inquiry.addressLine1}
                onChange={(e) => setInquiry({ ...inquiry, addressLine1: e.target.value })}
                placeholder="Address Line 1" 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input 
                type="text"
                value={inquiry.addressLine2}
                onChange={(e) => setInquiry({ ...inquiry, addressLine2: e.target.value })}
                placeholder="Address Line 2" 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text"
                  value={inquiry.city}
                  onChange={(e) => setInquiry({ ...inquiry, city: e.target.value })}
                  placeholder="City" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input 
                  type="text"
                  value={inquiry.state}
                  onChange={(e) => setInquiry({ ...inquiry, state: e.target.value })}
                  placeholder="State" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input 
                  type="text"
                  value={inquiry.pincode}
                  onChange={(e) => setInquiry({ ...inquiry, pincode: e.target.value })}
                  placeholder="Pincode" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
                />
              </div>
            </div>

            {/* Tech Background */}
            <div className="space-y-2">
<<<<<<< HEAD
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
=======
              <label className="text-sm font-medium text-gray-700">Tech Background</label>
              <select 
                value={inquiry.techBackground}
                onChange={(e) => setInquiry({ ...inquiry, techBackground: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select background</option>
                <option value="tech">Tech</option>
                <option value="non-tech">Non Tech</option>
              </select>
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
            </div>

            {/* Education */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
<<<<<<< HEAD
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
=======
                <label className="text-sm font-medium text-gray-700">Qualification</label>
                <input 
                  type="text"
                  value={inquiry.qualification}
                  onChange={(e) => setInquiry({ ...inquiry, qualification: e.target.value })}
                  placeholder="e.g. BSc, BTech" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Specialization</label>
                <input 
                  type="text"
                  value={inquiry.specialization}
                  onChange={(e) => setInquiry({ ...inquiry, specialization: e.target.value })}
                  placeholder="e.g. Computer Science" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Passing Year</label>
                <input 
                  type="number" 
                  value={inquiry.passingYear}
                  onChange={(e) => setInquiry({ ...inquiry, passingYear: e.target.value })}
                  placeholder="2024" 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
                />
              </div>
            </div>

            {/* Interested Area */}
            <div className="space-y-2">
<<<<<<< HEAD
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
=======
              <label className="text-sm font-medium text-gray-700">Interested Area</label>
              <input 
                type="text"
                value={inquiry.interestedArea}
                onChange={(e) => setInquiry({ ...inquiry, interestedArea: e.target.value })}
                placeholder="Web Development, Data Science, etc." 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
              />
            </div>

            {/* Assign */}
            <div className="space-y-2">
<<<<<<< HEAD
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
=======
              <label className="text-sm font-medium text-gray-700">Assign To</label>
              <select 
                value={inquiry.assignTo}
                onChange={(e) => setInquiry({ ...inquiry, assignTo: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select counsellor</option>
                <option value="c1">Counsellor 1</option>
                <option value="c2">Counsellor 2</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
>>>>>>> 7ffb7aa16d89c363fd577cd5004b49e3b56959b0
  );
}
