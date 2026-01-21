import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EventForm() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white text-black shadow-lg rounded-2xl border border-zinc-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Create Event
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Event Title */}
          <div className="space-y-1">
            <Label>Event Title</Label>
            <Input placeholder="Enter event title" />
          </div>

          {/* Event Detail */}
          <div className="space-y-1">
            <Label>Event Detail</Label>
            <Input placeholder="Short event detail" />
          </div>

          {/* Host */}
          <div className="space-y-1">
            <Label>Host</Label>
            <Input placeholder="Host name" />
          </div>

          {/* Coordinator */}
          <div className="space-y-1">
            <Label>Coordinator</Label>
            <Input placeholder="Coordinator name" />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label>Date</Label>
            <Input type="date" />
          </div>

          {/* Timing */}
          <div className="space-y-1">
            <Label>Timing</Label>
            <Input placeholder="e.g. 10:00 AM - 1:00 PM" />
          </div>

          {/* Event Place */}
          <div className="space-y-1">
            <Label>Event Place</Label>
            <Input placeholder="Auditorium / Hall / Classroom" />
          </div>

          {/* Event Type */}
          <div className="space-y-1">
            <Label>Event Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea placeholder="Event description" />
          </div>

          {/* Location Link */}
          <div className="space-y-1">
            <Label>Location Link</Label>
            <Input placeholder="Google Maps link" />
          </div>

          {/* Submit Button */}
          <Button
            className="
              w-full mt-4 
              bg-black text-white 
              transition-all duration-300 
              hover:bg-zinc-700 hover:shadow-lg
            "
          >
            Submit Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
