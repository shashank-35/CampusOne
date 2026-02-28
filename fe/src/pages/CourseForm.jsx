import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const API = "http://localhost:5000/api";

export function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

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
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      axios.get(`${API}/courses/${id}`, { headers })
        .then((res) => {
          const c = res.data.data;
          setCourse({
            title: c.title || "",
            description: c.description || "",
            duration: c.duration || "",
            fees: c.fees || "",
          });
        })
        .catch((err) => setError(err.response?.data?.message || "Failed to load course"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="w-full max-w-xl bg-white text-black shadow-lg rounded-2xl border border-zinc-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            {isEdit ? "Edit Course" : "Create Course"}
          </CardTitle>
        </CardHeader>

        {error && (
          <div className="mx-6 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Course Title</Label>
              <Input
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                placeholder="Enter course title"
                className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                placeholder="Enter course description"
                className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <Label>Duration</Label>
              <Input
                value={course.duration}
                onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                placeholder="e.g. 6 Months"
                className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <Label>Fees Structure</Label>
              <Input
                value={course.fees}
                onChange={(e) => setCourse({ ...course, fees: e.target.value })}
                placeholder="25,000"
                className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <Label>Handbook (PDF)</Label>
              <Input
                type="file"
                onChange={(e) => setHandbook(e.target.files[0])}
                className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <Label>Topic Sheet</Label>
              <Input
                type="file"
                onChange={(e) => setTopicSheet(e.target.files[0])}
                className="bg-white border-zinc-300 text-black focus-visible:ring-zinc-400"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-black text-white transition-all duration-300 hover:bg-zinc-700 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update Course" : "Submit Course"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
