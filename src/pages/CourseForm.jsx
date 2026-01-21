import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export  function CourseForm() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {/* Course Form Card */}
      <Card className="w-full max-w-xl bg-white text-black shadow-lg rounded-2xl border border-zinc-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Create Course
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Course Title */}
          <div className="space-y-1">
            <Label>Course Title</Label>
            <Input
              placeholder="Enter course title"
              className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              placeholder="Enter course description"
              className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
            />
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <Label>Duration</Label>
            <Input
              placeholder="e.g. 6 Months"
              className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
            />
          </div>

          {/* Fees Structure */}
          <div className="space-y-1">
            <Label>Fees Structure</Label>
            <Input
              placeholder="₹ 25,000"
              className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
            />
          </div>

          {/* Handbook */}
          <div className="space-y-1">
            <Label>Handbook (PDF)</Label>
            <Input
              type="file"
              className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
            />
          </div>

          {/* Topic Sheet */}
          <div className="space-y-1">
            <Label>Topic Sheet</Label>
            <Input
              type="file"
              className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
            />
          </div>

          {/* Submit Button with Hover Effect */}
          <Button
            className="
              w-full mt-4 
              bg-black text-white 
              transition-all duration-300 
              hover:bg-zinc-700 hover:shadow-lg hover:scale-[1.02]
            "
          >
            Submit Course
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
