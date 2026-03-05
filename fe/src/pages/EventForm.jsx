import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API = "http://localhost:5000/api";

export function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [event, setEvent] = useState({
    title: "",
    detail: "",
    host: "",
    coordinator: "",
    date: "",
    timing: "",
    place: "",
    type: "",
    description: "",
    locationLink: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Add useEffect to fetch event by id when isEdit is true
useEffect(() => {
  if (isEdit) {
    setLoading(true);
    axios.get(`${API}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const data = res.data.data;
        setEvent({
          title: data.title || "",
          detail: data.detail || "",
          host: data.host || "",
          coordinator: data.coordinator || "",
          date: data.date ? data.date.split("T")[0] : "",
          timing: data.timing || "",
          place: data.place || "",
          type: data.type || "",
          description: data.description || "",
          locationLink: data.locationLink || "",
        });
      })
      .catch(() => setError("Failed to load event data"))
      .finally(() => setLoading(false));
  }
}, [id, isEdit]);


  // TODO: Add API call in handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Form data:", event);
    
try{
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  if (isEdit) {
    await axios.put(`${API}/events/${id}`, event, { headers });
}else {
    await axios.post(`${API}/events`, event, { headers });
}
    navigate("/event");
  }catch (err) {
    setError(err.response?.data?.message || "Failed to save event");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="pb-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {isEdit ? "Edit Event" : "Create Event"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <div className="space-y-10 p-6">
          <form onSubmit={handleSubmit}>
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Event Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    placeholder="Enter event title"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Event Detail
                  </label>
                  <input
                    type="text"
                    value={event.detail}
                    onChange={(e) => setEvent({ ...event, detail: e.target.value })}
                    placeholder="Short event detail"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Host
                  </label>
                  <input
                    type="text"
                    value={event.host}
                    onChange={(e) => setEvent({ ...event, host: e.target.value })}
                    placeholder="Host name"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Coordinator
                  </label>
                  <input
                    type="text"
                    value={event.coordinator}
                    onChange={(e) => setEvent({ ...event, coordinator: e.target.value })}
                    placeholder="Coordinator name"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Date
                  </label>
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) => setEvent({ ...event, date: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Timing
                  </label>
                  <input
                    type="text"
                    value={event.timing}
                    onChange={(e) => setEvent({ ...event, timing: e.target.value })}
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Event Place
                  </label>
                  <input
                    type="text"
                    value={event.place}
                    onChange={(e) => setEvent({ ...event, place: e.target.value })}
                    placeholder="Auditorium / Hall / Classroom"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Event Type
                  </label>
                  <select
                    value={event.type}
                    onChange={(e) => setEvent({ ...event, type: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  >
                    <option value="">Select event type</option>
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Description
                </label>
                <textarea
                  value={event.description}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                  placeholder="Event description"
                  rows="4"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Location Link
                </label>
                <input
                  type="text"
                  value={event.locationLink}
                  onChange={(e) => setEvent({ ...event, locationLink: e.target.value })}
                  placeholder="Google Maps link"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base border border-gray-300 rounded-md text-white font-medium bg-[var(--theme-button-color)] hover:bg-[var(--theme-background-color)] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : isEdit ? "Update Event" : "Submit Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
