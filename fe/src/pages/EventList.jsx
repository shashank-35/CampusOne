import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Mock Data
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    type: "Seminar",
    date: "2024-03-15",
    time: "10:00 AM",
    location: "Main Auditorium",
    organizer: "Tech Club",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Annual Sports Meet",
    type: "Sports",
    date: "2024-04-10",
    time: "08:00 AM",
    location: "Sports Ground",
    organizer: "Sports Department",
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Cultural Fest 2024",
    type: "Cultural",
    date: "2024-02-20",
    time: "05:00 PM",
    location: "Open Air Theatre",
    organizer: "Cultural Committee",
    status: "Completed",
  },
  {
    id: 4,
    title: "AI & ML Workshop",
    type: "Workshop",
    date: "2024-03-25",
    time: "09:00 AM",
    location: "Lab 3",
    organizer: "CS Department",
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Career Guidance Webinar",
    type: "Webinar",
    date: "2024-03-05",
    time: "02:00 PM",
    location: "Online",
    organizer: "Placement Cell",
    status: "Completed",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Upcoming: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Ongoing: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default function EventList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleSelectAll = () => {
    if (selectedEvents.length === MOCK_EVENTS.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(MOCK_EVENTS.map((e) => e.id));
    }
  };

  const toggleSelectEvent = (id) => {
    if (selectedEvents.includes(id)) {
      setSelectedEvents(selectedEvents.filter((eid) => eid !== id));
    } else {
      setSelectedEvents([...selectedEvents, id]);
    }
  };

  const viewEvent = (event) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500">
            Manage upcoming and past events, seminars, and workshops.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link to="/event/create">
            <Button className="bg-black hover:bg-zinc-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Event..."
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-[140px] bg-white border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span>Filter</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
            </SelectContent>
          </Select>
            <Select defaultValue="10">
            <SelectTrigger className="w-[80px] bg-white border-gray-200">
               <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <Checkbox
                    checked={selectedEvents.length === MOCK_EVENTS.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">EVENT NAME</th>
                <th className="p-4">TYPE</th>
                <th className="p-4">DATE & TIME</th>
                <th className="p-4">LOCATION</th>
                <th className="p-4">ORGANIZER</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_EVENTS.filter((e) =>
                e.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((event) => (
                <tr
                  key={event.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <Checkbox
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => toggleSelectEvent(event.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{event.title}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                      {event.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-gray-600 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" /> {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" /> {event.time}
                      </div>

                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-3 w-3" /> {event.location}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{event.organizer}</td>
                  <td className="p-4">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => viewEvent(event)} className="h-8 w-8 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-green-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Event Details</DialogTitle>
                    <DialogDescription>
                      View complete information for the selected event
                    </DialogDescription>
                  </DialogHeader>
                  {selectedEvent && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                       
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedEvent.title}
                          </h3>
                          
                        </div>
                      </div>
        
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">
                            Type
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedEvent.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">
                            Date
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedEvent.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">
                            Time
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedEvent.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">
                            Location
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedEvent.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">
                            Organizer
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedEvent.organizer}
                          </p>
                        </div>
      
                      </div>
        
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Status
                        </p>
                        <StatusBadge status={selectedEvent.status} />
                      </div>
        
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() =>
                            navigate(`/student/edit/${selectedEvent.id}`)
                          }
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          onClick={() => setViewDialogOpen(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
         {/* Pagination Mock */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1-5 of 12 events</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
