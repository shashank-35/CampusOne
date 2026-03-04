import React, { useState, useEffect } from "react";
import {
  Search, Plus, Filter, Download, Trash2, Edit, Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

const API = "http://localhost:5000/api";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    suspended: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    axios.get(`${API}/students`, { params: { search: searchTerm }, headers })
      .then((res) => setStudents(res.data.data || []))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };
//  useEffect(() => { fetchStudents();
//  } );
  useEffect(() => { fetchStudents(); }, []);

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s._id));
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API}/students/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      fetchStudents();
    } catch {}
  };

  const viewStudent = (student) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500">Manage your student records enrolled in the system.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link to="/student/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Student..."
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
                  <Checkbox checked={selectedStudents.length === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} />
                </th>
                <th className="p-4">STUDENT</th>
                <th className="p-4">MOBILE</th>
                <th className="p-4">CITY</th>
                <th className="p-4">BACKGROUND</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No students found.</td></tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student._id} className="group hover:bg-blue-50/50 transition-colors">
                    <td className="p-4">
                      <Checkbox checked={selectedStudents.includes(student._id)} onCheckedChange={() => toggleSelectStudent(student._id)} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                          <div className="text-gray-500 text-xs">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{student.mobileNumber}</td>
                    <td className="p-4 text-gray-600">{student.city}</td>
                    <td className="p-4 text-gray-600 capitalize">{student.background}</td>
                    <td className="p-4"><StatusBadge status={student.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => viewStudent(student)} className="h-8 w-8 hover:text-blue-600"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/student/edit/${student._id}`)} className="h-8 w-8 hover:text-green-600"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(student._id)} className="h-8 w-8 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div>Showing {filtered.length} students</div>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View complete information for the selected student</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Mobile</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudent.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">City</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudent.city}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Background</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{selectedStudent.background}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <StatusBadge status={selectedStudent.status} />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => navigate(`/student/edit/${selectedStudent._id}`)} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
