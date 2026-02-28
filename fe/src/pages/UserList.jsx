import React, { useState } from "react";
import {
  Search, Plus, Download, Trash2, Edit, Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const styles = {
    student: "bg-blue-100 text-blue-700",
    staff: "bg-purple-100 text-purple-700",
    head: "bg-orange-100 text-orange-700",
    admin: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[role] || "bg-gray-100 text-gray-700"}`}>
      {role}
    </span>
  );
};

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  // TODO: Add fetchUsers function with API call
  // TODO: Add useEffect to fetch on mount

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u._id));
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ${name}?`)) return;
    // TODO: Add API delete call
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage users, faculty, students, and administrators.</p>
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
          <Select value={itemsPerPage.toString()} onValueChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <Checkbox checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0} onCheckedChange={toggleSelectAll} />
                </th>
                <th className="p-4">NAME</th>
                <th className="p-4">EMAIL</th>
                <th className="p-4">PHONE</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : paginatedUsers.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No users found.</td></tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <Checkbox checked={selectedUsers.includes(user._id)} onCheckedChange={() => toggleSelectUser(user._id)} />
                    </td>
                    <td className="p-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.mobileNumber}</td>
                    <td className="p-4"><RoleBadge role={user.role} /></td>
                    <td className="p-4"><StatusBadge status={user.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={() => { setSelectedUserDetails(user); setIsDialogOpen(true); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => navigate(`/user/edit/${user._id}`)} className="p-1.5 hover:bg-yellow-50 rounded text-yellow-600 transition-colors"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)} className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="bg-white hover:bg-gray-50">Previous</Button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages || 1}</span>
          <Button variant="outline" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="bg-white hover:bg-gray-50">Next</Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUserDetails && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-700">
                    {selectedUserDetails.firstName?.[0]}{selectedUserDetails.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUserDetails.firstName} {selectedUserDetails.lastName}</h3>
                  <p className="text-sm text-gray-500">{selectedUserDetails.email}</p>
                </div>
                <DialogClose className="ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400">PHONE</p>
                  <p className="text-sm font-medium">{selectedUserDetails.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">ROLE</p>
                  <RoleBadge role={selectedUserDetails.role} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">STATUS</p>
                  <StatusBadge status={selectedUserDetails.status} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => { navigate(`/user/edit/${selectedUserDetails._id}`); setIsDialogOpen(false); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="flex-1">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
