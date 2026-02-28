import React, { useState } from "react";
import {
  Search, Plus, Download, Trash2, Edit, Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    draft: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  // TODO: Add fetchCourses function with API call
  // TODO: Add useEffect to fetch on mount

  const toggleSelectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map((c) => c._id));
    }
  };

  const toggleSelectCourse = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    // TODO: Add API delete call
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500">Manage your course catalog and curriculum.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link to="/course/create">
            <Button className="bg-black hover:bg-zinc-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Course..."
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
                  <Checkbox checked={selectedCourses.length === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} />
                </th>
                <th className="p-4">COURSE TITLE</th>
                <th className="p-4">DURATION</th>
                <th className="p-4">FEES</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No courses found.</td></tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <Checkbox checked={selectedCourses.includes(course._id)} onCheckedChange={() => toggleSelectCourse(course._id)} />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{course.title}</div>
                      {course.description && <div className="text-gray-500 text-xs truncate max-w-xs">{course.description}</div>}
                    </td>
                    <td className="p-4 text-gray-600">{course.duration || "N/A"}</td>
                    <td className="p-4 text-gray-600">{course.fees || "N/A"}</td>
                    <td className="p-4"><StatusBadge status={course.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedCourse(course); setViewDialogOpen(true); }} className="h-8 w-8 hover:text-blue-600"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/course/edit/${course._id}`)} className="h-8 w-8 hover:text-green-600"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(course._id)} className="h-8 w-8 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Showing {filtered.length} courses
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>View complete information for the selected course</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedCourse.title}</h3>
              {selectedCourse.description && (
                <p className="text-sm text-gray-600">{selectedCourse.description}</p>
              )}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedCourse.duration || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Fees</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedCourse.fees || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <StatusBadge status={selectedCourse.status} />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => navigate(`/course/edit/${selectedCourse._id}`)} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
