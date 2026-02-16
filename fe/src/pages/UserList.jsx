import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Mock Data
const MOCK_USERS = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    role: "Student",
    status: "Active",
    dateJoined: "2024-01-15",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+91 87654 32109",
    role: "Faculty",
    status: "Active",
    dateJoined: "2023-06-20",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.j@example.com",
    phone: "+91 76543 21098",
    role: "Student",
    status: "Active",
    dateJoined: "2024-02-10",
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.brown@example.com",
    phone: "+91 65432 10987",
    role: "Admin",
    status: "Active",
    dateJoined: "2023-01-05",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@example.com",
    phone: "+91 54321 09876",
    role: "Faculty",
    status: "Inactive",
    dateJoined: "2022-09-12",
  },
  {
    id: 6,
    firstName: "Sarah",
    lastName: "Taylor",
    email: "sarah.taylor@example.com",
    phone: "+91 43210 98765",
    role: "Student",
    status: "Active",
    dateJoined: "2024-03-01",
  },
  {
    id: 7,
    firstName: "Robert",
    lastName: "Martinez",
    email: "robert.m@example.com",
    phone: "+91 32109 87654",
    role: "Student",
    status: "Active",
    dateJoined: "2024-01-22",
  },
  {
    id: 8,
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@example.com",
    phone: "+91 21098 76543",
    role: "Faculty",
    status: "Active",
    dateJoined: "2023-07-18",
  },
  {
    id: 9,
    firstName: "James",
    lastName: "Thomas",
    email: "james.thomas@example.com",
    phone: "+91 10987 65432",
    role: "Admin",
    status: "Active",
    dateJoined: "2023-03-09",
  },
  {
    id: 10,
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    phone: "+91 98765 43211",
    role: "Student",
    status: "Active",
    dateJoined: "2024-02-15",
  },
  {
    id: 11,
    firstName: "William",
    lastName: "Rodriguez",
    email: "william.r@example.com",
    phone: "+91 87654 32110",
    role: "Faculty",
    status: "Inactive",
    dateJoined: "2022-10-30",
  },
  {
    id: 12,
    firstName: "Jennifer",
    lastName: "Lee",
    email: "jennifer.lee@example.com",
    phone: "+91 76543 21099",
    role: "Student",
    status: "Active",
    dateJoined: "2024-01-08",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
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

const RoleBadge = ({ role }) => {
  const styles = {
    Student: "bg-blue-100 text-blue-700",
    Faculty: "bg-purple-100 text-purple-700",
    Admin: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[role] || "bg-gray-100 text-gray-700"
      }`}
    >
      {role}
    </span>
  );
};

export default function UserList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const toggleSelectAll = () => {
    if (selectedUsers.length === MOCK_USERS.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(MOCK_USERS.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // Filter users based on search term
  const filteredUsers = MOCK_USERS.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">
            Manage users, faculty, students, and administrators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link to="/user/create">
            <Button className="bg-black hover:bg-zinc-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search User..."
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
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={itemsPerPage.toString()} onValueChange={(val) => {
            setItemsPerPage(Number(val));
            setCurrentPage(1);
          }}>
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
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">NAME</th>
                <th className="p-4">EMAIL</th>
                <th className="p-4">PHONE</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">DATE JOINED</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleSelectUser(user.id)}
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.phone}</td>
                  <td className="p-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(user.dateJoined).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedUserDetails(user);
                          setIsDialogOpen(true);
                        }}
                        className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => navigate(`/user/edit/${user.id}`)}
                        className="p-1.5 hover:bg-yellow-50 rounded text-yellow-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Delete ${user.firstName} ${user.lastName}?`)) {
                            alert("User deleted!");
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}{" "}
          users
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-white hover:bg-gray-50"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-white hover:bg-gray-50"
          >
            Next
          </Button>
        </div>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUserDetails && (
            <div className="space-y-6">
              {/* User Avatar & Name */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-700">
                    {selectedUserDetails.firstName[0]}
                    {selectedUserDetails.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedUserDetails.firstName} {selectedUserDetails.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUserDetails.email}</p>
                </div>
                <DialogClose className="ml-auto" />
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400">PHONE</p>
                  <p className="text-sm font-medium">{selectedUserDetails.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">ROLE</p>
                  <p className="text-sm font-medium">
                    <RoleBadge role={selectedUserDetails.role} />
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">DATE JOINED</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedUserDetails.dateJoined).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">STATUS</p>
                  <p className="text-sm font-medium">
                    <StatusBadge status={selectedUserDetails.status} />
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    navigate(`/user/edit/${selectedUserDetails.id}`);
                    setIsDialogOpen(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
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
