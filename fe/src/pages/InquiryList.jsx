import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Edit,
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
import {useNavigate} from "react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";


// Mock Data
const MOCK_INQUIRIES = [
  {
    id: 1,
    name: "Michael Scott",
    mobile: "9876543210",
    email: "michael@dunder.com",
    source: "Website",
    date: "2024-03-10",
    subject: "Admission for Class 5",
    status: "New",
  },
  {
    id: 2,
    name: "Pam Beesly",
    mobile: "9876543211",
    email: "pam@art.com",
    source: "Social Media",
    date: "2024-03-09",
    subject: "Art Class Details",
    status: "Contacted",
  },
  {
    id: 3,
    name: "Jim Halpert",
    mobile: "9876543212",
    email: "jim@sports.com",
    source: "Reference",
    date: "2024-03-08",
    subject: "Sports Facilities Inquiry",
    status: "Resolved",
  },
  {
    id: 4,
    name: "Dwight Schrute",
    mobile: "9876543213",
    email: "dwight@farms.com",
    source: "Website",
    date: "2024-03-07",
    subject: "Hostel Availability",
    status: "New",
  },
  {
    id: 5,
    name: "Angela Martin",
    mobile: "9876543214",
    email: "angela@cats.com",
    source: "Social Media",
    date: "2024-03-06",
    subject: "Fee Structure",
    status: "Contacted",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-orange-100 text-orange-700",
    Resolved: "bg-green-100 text-green-700",
    Closed: "bg-gray-100 text-gray-700",
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

export default function InquiryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiries, setSelectedInquiries] = useState([]);

  //Dialog Box Usestate
    const [viewDialogOpenInquiry, setViewDialogOpenInquiry] = useState(false);
    const [selectedStudentInquiry, setSelectedStudentInquiry] = useState(null);

  const toggleSelectAll = () => {
    if (selectedInquiries.length === MOCK_INQUIRIES.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(MOCK_INQUIRIES.map((i) => i.id));
    }
  };

  const toggleSelectInquiry = (id) => {
    if (selectedInquiries.includes(id)) {
      setSelectedInquiries(selectedInquiries.filter((iid) => iid !== id));
    } else {
      setSelectedInquiries([...selectedInquiries, id]);
    }
  };

  const navigate = useNavigate();

    const viewStudentInquiry = (inquiry) => {
      setSelectedStudentInquiry(inquiry);
      setViewDialogOpenInquiry(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-sm text-gray-500">
            Track and manage student admission inquiries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link to="/inquiry/create">
            <Button className="bg-black hover:bg-zinc-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Inquiry
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Inquiry..."
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
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
                    checked={selectedInquiries.length === MOCK_INQUIRIES.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">INQUIRER</th>
                <th className="p-4">CONTACT INFO</th>
                <th className="p-4">SUBJECT & DATE</th>
                <th className="p-4">SOURCE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_INQUIRIES.filter((i) =>
                i.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <Checkbox
                      checked={selectedInquiries.includes(inquiry.id)}
                      onCheckedChange={() => toggleSelectInquiry(inquiry.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{inquiry.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-gray-600 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3" /> {inquiry.mobile}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3" /> {inquiry.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex flex-col text-gray-600 space-y-1">
                         <div className="text-gray-900 font-medium">{inquiry.subject}</div>
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3" /> {inquiry.date}
                          </div>
                     </div>
                  </td>
                  <td className="p-4 text-gray-600">{inquiry.source}</td>
                  <td className="p-4">
                    <StatusBadge status={inquiry.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 ">
                       <Button variant="ghost" size="icon" onClick={() => viewStudentInquiry(inquiry)} className="h-8 w-8 hover:text-blue-600">
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
          <div>Showing 1-5 of 12 inquiries</div>
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

          {/* View Student Dialog */}
          <Dialog open={viewDialogOpenInquiry} onOpenChange={setViewDialogOpenInquiry}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Inquiry Details</DialogTitle>
                <DialogDescription>
                  View complete information for the Inquiry
                </DialogDescription>
              </DialogHeader>
              {selectedStudentInquiry && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                      {selectedStudentInquiry.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedStudentInquiry.name}
                      </h3>
                      <p className="text-sm text-gray-500">{selectedStudentInquiry.email}</p>
                    </div>
                  </div>
    
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Mobile
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedStudentInquiry.mobile}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        date
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedStudentInquiry.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Stream
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedStudentInquiry.stream}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Year
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedStudentInquiry.year}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Fees Status
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          selectedStudentInquiry.Status === "Paid"
                            ? "text-green-600"
                            : selectedStudentInquiry.Status === "Overdue"
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}
                      >
                        {selectedStudentInquiry.Status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Attendance
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedStudentInquiry.attendance}
                      </p>
                    </div>
                  </div>
    
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Status
                    </p>
                    <StatusBadge status={selectedStudentInquiry.status} />
                  </div>
    
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() =>
                        navigate(`/student/edit/${selectedStudentInquiry.id}`)
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      onClick={() => setViewDialogOpenInquiry(false)}
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


    </div>
  );
}
