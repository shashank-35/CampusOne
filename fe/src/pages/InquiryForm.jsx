import { useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function InquiryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [inquiry, setInquiry] = useState({
    sourceOfInquiry: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "male",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    techBackground: "",
    qualification: "",
    specialization: "",
    passingYear: "",
    interestedArea: "",
    assignTo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Add useEffect to fetch inquiry by id when isEdit is true
  // TODO: Add API call in handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", inquiry);
    navigate("/inquiry");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-md border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Inquiry" : "Inquiry Form"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Source of Inquiry</label>
              <select value={inquiry.sourceOfInquiry} onChange={(e) => setInquiry({ ...inquiry, sourceOfInquiry: e.target.value })} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select source</option>
                <option value="website">Website</option>
                <option value="reference">Reference</option>
                <option value="social">Social Media</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input type="text" value={inquiry.firstName} onChange={(e) => setInquiry({ ...inquiry, firstName: e.target.value })} placeholder="Enter first name" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" value={inquiry.lastName} onChange={(e) => setInquiry({ ...inquiry, lastName: e.target.value })} placeholder="Enter last name" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} placeholder="example@mail.com" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" value={inquiry.dateOfBirth} onChange={(e) => setInquiry({ ...inquiry, dateOfBirth: e.target.value })} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <div className="flex gap-6">
                {["male", "female", "other"].map((g) => (
                  <div key={g} className="flex items-center space-x-2">
                    <input type="radio" id={g} name="gender" value={g} checked={inquiry.gender === g} onChange={(e) => setInquiry({ ...inquiry, gender: e.target.value })} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                    <label htmlFor={g} className="text-sm font-medium text-gray-700 capitalize">{g}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mobile Number</label>
              <input type="tel" value={inquiry.mobile} onChange={(e) => setInquiry({ ...inquiry, mobile: e.target.value })} placeholder="Enter mobile number" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input type="text" value={inquiry.addressLine1} onChange={(e) => setInquiry({ ...inquiry, addressLine1: e.target.value })} placeholder="Address Line 1" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input type="text" value={inquiry.addressLine2} onChange={(e) => setInquiry({ ...inquiry, addressLine2: e.target.value })} placeholder="Address Line 2" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" value={inquiry.city} onChange={(e) => setInquiry({ ...inquiry, city: e.target.value })} placeholder="City" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" value={inquiry.state} onChange={(e) => setInquiry({ ...inquiry, state: e.target.value })} placeholder="State" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <input type="text" value={inquiry.pincode} onChange={(e) => setInquiry({ ...inquiry, pincode: e.target.value })} placeholder="Pincode" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tech Background</label>
              <select value={inquiry.techBackground} onChange={(e) => setInquiry({ ...inquiry, techBackground: e.target.value })} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select background</option>
                <option value="tech">Tech</option>
                <option value="non-tech">Non Tech</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Qualification</label>
                <input type="text" value={inquiry.qualification} onChange={(e) => setInquiry({ ...inquiry, qualification: e.target.value })} placeholder="e.g. BSc, BTech" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Specialization</label>
                <input type="text" value={inquiry.specialization} onChange={(e) => setInquiry({ ...inquiry, specialization: e.target.value })} placeholder="e.g. Computer Science" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Passing Year</label>
                <input type="number" value={inquiry.passingYear} onChange={(e) => setInquiry({ ...inquiry, passingYear: e.target.value })} placeholder="2024" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Interested Area</label>
              <input type="text" value={inquiry.interestedArea} onChange={(e) => setInquiry({ ...inquiry, interestedArea: e.target.value })} placeholder="Web Development, Data Science, etc." className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
              {loading ? "Saving..." : isEdit ? "Update Inquiry" : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
