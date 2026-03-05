import React, { useEffect, useState } from "react";
import {
  Search, Plus, Download, Phone, Mail, Trash2, Edit, Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
const API = "http://localhost:5000/api";
const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-orange-100 text-orange-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const navigate = useNavigate();

  const fetchInquiries = () => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    axios.get(`${API}/inquiries`, { params: { search: searchTerm }, headers })
      .then((res) => setInquiries(res.data.data || []))
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);
  const toggleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map((i) => i._id));
    }
  };

  const toggleSelectInquiry = (id) => {
    setSelectedInquiries((prev) =>
      prev.includes(id) ? prev.filter((iid) => iid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await axios.delete(`${API}/inquiries/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      fetchInquiries();
    } catch {}
  };

  const viewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setViewDialogOpen(true);
  };

  const filtered = inquiries.filter((i) =>
    `${i.firstName} ${i.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-sm text-gray-500">Track and manage student admission inquiries.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link to="/inquiry/create">
            <Button className="bg-[var(--theme-button-color)] hover:bg-[var(--theme-background-color)] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Inquiry
            </Button>
          </Link>
        </div>
      </div>

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
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <Checkbox checked={selectedInquiries.length === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} />
                </th>
                <th className="p-4">INQUIRER</th>
                <th className="p-4">CONTACT INFO</th>
                <th className="p-4">SOURCE</th>
                <th className="p-4">INTERESTED AREA</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No inquiries found.</td></tr>
              ) : (
                filtered.map((inquiry) => (
                  <tr key={inquiry._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <Checkbox checked={selectedInquiries.includes(inquiry._id)} onCheckedChange={() => toggleSelectInquiry(inquiry._id)} />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{inquiry.firstName} {inquiry.lastName}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-gray-600 space-y-1">
                        <div className="flex items-center gap-2 text-xs"><Phone className="h-3 w-3" /> {inquiry.mobile}</div>
                        <div className="flex items-center gap-2 text-xs"><Mail className="h-3 w-3" /> {inquiry.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 capitalize">{inquiry.sourceOfInquiry}</td>
                    <td className="p-4 text-gray-600">{inquiry.interestedArea}</td>
                    <td className="p-4"><StatusBadge status={inquiry.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => viewInquiry(inquiry)} className="h-8 w-8 hover:text-blue-600"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/inquiry/edit/${inquiry._id}`)} className="h-8 w-8 hover:text-green-600"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(inquiry._id)} className="h-8 w-8 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <div>Showing {filtered.length} inquiries</div>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>View complete information for the inquiry</DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedInquiry.firstName} {selectedInquiry.lastName}</h3>
                <p className="text-sm text-gray-500">{selectedInquiry.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Mobile</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedInquiry.mobile}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Source</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{selectedInquiry.sourceOfInquiry}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Interested Area</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedInquiry.interestedArea}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <StatusBadge status={selectedInquiry.status} />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => navigate(`/inquiry/edit/${selectedInquiry._id}`)} className="flex-1 bg-[var(--theme-button-color)] hover:bg-[var(--theme-background-color)]">
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
