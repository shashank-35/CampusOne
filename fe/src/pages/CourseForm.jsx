import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API = "http://localhost:5000/api";

export function CourseForm() {
  const { id } = useParams();
  console.log("🚀 ~ CourseForm ~ d:", id)

  const navigate = useNavigate();
  const isEdit = Boolean(id);
  console.log("🚀 ~ CourseForm ~ isEdit:", isEdit)

  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    fees: "",
  });
  const [handbook, setHandbook] = useState(null);
  const [topicSheet, setTopicSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      axios
        .get(`${API}/courses/${id}`, { headers })
        .then((res) => {
          const c = res.data.data;
          setCourse({
            title: c.title || "",
            description: c.description || "",
            duration: c.duration || "",
            fees: c.fees || "",
          });
        })
        .catch((err) =>
          setError(err.response?.data?.message || "Failed to load course"),
        )
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("duration", course.duration);
      formData.append("fees", course.fees);
      if (handbook) formData.append("handbook", handbook);
      if (topicSheet) formData.append("topicSheet", topicSheet);

      if (isEdit) {
        await axios.put(`${API}/courses/${id}`, formData, { headers });
      } else {
        await axios.post(`${API}/courses`, formData, { headers });
      }
      navigate("/course");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit && !course.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="pb-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {isEdit ? "Edit Course" : "Create Course"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-10 p-6">
          <form onSubmit={handleSubmit}>
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Course Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) =>
                      setCourse({ ...course, title: e.target.value })
                    }
                    placeholder="Enter course title"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={course.duration}
                    onChange={(e) =>
                      setCourse({ ...course, duration: e.target.value })
                    }
                    placeholder="e.g. 6 Months"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Description
                </label>
                <textarea
                  value={course.description}
                  onChange={(e) =>
                    setCourse({ ...course, description: e.target.value })
                  }
                  placeholder="Enter course description"
                  rows="4"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Fees Structure
                </label>
                <input
                  type="text"
                  value={course.fees}
                  onChange={(e) => setCourse({ ...course, fees: e.target.value })}
                  placeholder="25,000"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Attachments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Handbook (PDF)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setHandbook(e.target.files[0])}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Topic Sheet
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setTopicSheet(e.target.files[0])}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base border border-gray-300 rounded-md text-white font-medium bg-[var(--theme-button-color)] hover:bg-[var(--theme-background-color)] transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Course"
                    : "Submit Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
