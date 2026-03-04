import React, { useEffect, useState } from "react";
import {
  Search, Plus, Download, Calendar, MapPin, Clock, Trash2, Edit, Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

const API = "http://localhost:5000/api";
const StatusBadge = ({ status }) => {
  const styles = {
    upcoming: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    ongoing: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  // TODO: Add fetchEvents function with API call
  const fetchEvents = () => {
    setLoading(true);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    axios.get(`${API}/events`, { params: { search: searchTerm }, headers })
      .then((res) => setEvents(res.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  const toggleSelectAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map((e) => e._id));
    }
  };

  const toggleSelectEvent = (id) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API}/events/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      fetchEvents();
    } catch {}
  };

  const viewEvent = (event) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500">Manage upcoming and past events, seminars, and workshops.</p>
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
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <Checkbox checked={selectedEvents.length === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} />
                </th>
                <th className="p-4">EVENT NAME</th>
                <th className="p-4">TYPE</th>
                <th className="p-4">DATE & TIME</th>
                <th className="p-4">LOCATION</th>
                <th className="p-4">HOST</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">No events found.</td></tr>
              ) : (
                filtered.map((event) => (
                  <tr key={event._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <Checkbox checked={selectedEvents.includes(event._id)} onCheckedChange={() => toggleSelectEvent(event._id)} />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {event.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-gray-600 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3" /> {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3" /> {event.timing || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-3 w-3" /> {event.place || "N/A"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{event.host}</td>
                    <td className="p-4"><StatusBadge status={event.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => viewEvent(event)} className="h-8 w-8 hover:text-blue-600"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/event/edit/${event._id}`)} className="h-8 w-8 hover:text-green-600"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(event._id)} className="h-8 w-8 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div>Showing {filtered.length} events</div>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>View complete information for the selected event</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Type</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{selectedEvent.type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.timing}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.place}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Host</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEvent.host}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <StatusBadge status={selectedEvent.status} />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => navigate(`/event/edit/${selectedEvent._id}`)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button onClick={() => setViewDialogOpen(false)} variant="outline" className="flex-1">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
