import React, { useState } from "react";

export function EventForm() {
  const [event, setEvent] = useState({
    eventTitle: "",
    eventDetail: "",
    host: "",
    coordinator: "",
    date: "",
    timing: "",
    eventPlace: "",
    eventType: "",
    description: "",
    locationLink: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(event);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white text-black shadow-lg rounded-2xl border border-zinc-200">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-2xl text-center font-semibold">
            Create Event
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
          {/* Event Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Event Title</label>
            <input 
              type="text"
              value={event.eventTitle}
              onChange={(e) => setEvent({ ...event, eventTitle: e.target.value })}
              placeholder="Enter event title" 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Event Detail */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Event Detail</label>
            <input 
              type="text"
              value={event.eventDetail}
              onChange={(e) => setEvent({ ...event, eventDetail: e.target.value })}
              placeholder="Short event detail" 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Host */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Host</label>
            <input 
              type="text"
              value={event.host}
              onChange={(e) => setEvent({ ...event, host: e.target.value })}
              placeholder="Host name" 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Coordinator */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Coordinator</label>
            <input 
              type="text"
              value={event.coordinator}
              onChange={(e) => setEvent({ ...event, coordinator: e.target.value })}
              placeholder="Coordinator name" 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input 
              type="date"
              value={event.date}
              onChange={(e) => setEvent({ ...event, date: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Timing */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Timing</label>
            <input 
              type="text"
              value={event.timing}
              onChange={(e) => setEvent({ ...event, timing: e.target.value })}
              placeholder="e.g. 10:00 AM - 1:00 PM" 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Event Place */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Event Place</label>
            <input 
              type="text"
              value={event.eventPlace}
              onChange={(e) => setEvent({ ...event, eventPlace: e.target.value })}
              placeholder="Auditorium / Hall / Classroom" 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Event Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Event Type</label>
            <select 
              value={event.eventType}
              onChange={(e) => setEvent({ ...event, eventType: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            >
              <option value="">Select event type</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="webinar">Webinar</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              placeholder="Event description" 
              rows="4"
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 resize-none"
            />
          </div>

          {/* Location Link */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Location Link</label>
            <input 
              type="text"
              value={event.locationLink}
              onChange={(e) => setEvent({ ...event, locationLink: e.target.value })}
              placeholder="Google Maps link" 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white transition-all duration-300 hover:bg-zinc-700 hover:shadow-lg h-10 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            Submit Event
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
