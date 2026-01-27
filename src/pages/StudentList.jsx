import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  ChevronDown,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Data
const MOCK_STUDENTS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD",
    class: "10th",
    stream: "Science",
    year: "2023",
    rollNo: "101",
    feesStatus: "Paid",
    attendance: "95%",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "JS",
    class: "12th",
    stream: "Commerce",
    year: "2024",
    rollNo: "102",
    feesStatus: "Pending",
    attendance: "88%",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "AJ",
    class: "11th",
    stream: "Arts",
    year: "2023",
    rollNo: "103",
    feesStatus: "Paid",
    attendance: "92%",
    status: "Active",
  },
  {
    id: 4,
    name: "Robert Brown",
    email: "robert@example.com",
    avatar: "RB",
    class: "10th",
    stream: "Science",
    year: "2024",
    rollNo: "104",
    feesStatus: "Overdue",
    attendance: "75%",
    status: "Suspended",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "ED",
    class: "12th",
    stream: "Science",
    year: "2023",
    rollNo: "105",
    feesStatus: "Paid",
    attendance: "98%",
    status: "Active",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-700",
    Suspended: "bg-red-100 text-red-700",
    Scheduled: "bg-orange-100 text-orange-700",
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

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const toggleSelectAll = () => {
    if (selectedStudents.length === MOCK_STUDENTS.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(MOCK_STUDENTS.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500">
            Manage your student records enrolled in the system.
          </p>
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

      {/* Filters & Search */}
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
        <div className="flex items-center gap-2 w-full md:w-auto">
             <Select>
            <SelectTrigger className="w-[140px] bg-white border-gray-200">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span>Filter</span>
                </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10th">Class 10th</SelectItem>
              <SelectItem value="12th">Class 12th</SelectItem>
              <SelectItem value="active">Active</SelectItem>
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
                    checked={selectedStudents.length === MOCK_STUDENTS.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">STUDENT</th>
                <th className="p-4">CLASS & STREAM</th>
                <th className="p-4">FEES STATUS</th>
                <th className="p-4">ROLL NO</th>
                <th className="p-4">ATTENDANCE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_STUDENTS.filter((s) =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((student) => (
                <tr
                  key={student.id}
                  className="group hover:bg-blue-50/50 transition-colors"
                >
                  <td className="p-4">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleSelectStudent(student.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-700">
                      {student.class}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {student.stream}
                    </div>
                  </td>
                   <td className="p-4">
                     <span className={`font-medium ${
                        student.feesStatus === 'Paid' ? 'text-green-600' :
                        student.feesStatus === 'Overdue' ? 'text-red-600' : 'text-orange-600'
                     }`}>
                         {student.feesStatus}
                     </span>
                  </td>
                  <td className="p-4 text-gray-600">{student.rollNo}</td>
                  <td className="p-4 text-gray-600">{student.attendance}</td>
                  <td className="p-4">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
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
        {/* Pagination Mock */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1-5 of 12 students</div>
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
