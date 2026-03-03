import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import  axios from "axios";
export function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);


  const API = "http://localhost:5000/api";
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Add useEffect to fetch user by id when isEdit is true
  // TODO: Add API call in userHandler

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const userHandler = async (e) => {
    e.preventDefault();
    console.log("Form data:", user);

const res = await axios.post(
  `${API}/users`,
  user,
  {
    hearders:{
      Authorization: `Bearer ${localStorage.getItem("token")}`,

    },
  },
);
    console.log("API response:", res.data);
    navigate("/user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
      <div className="w-full max-w-2xl border border-black rounded-lg">
        <div className="border-b border-black p-6">
          <h2 className="text-2xl font-semibold text-center">
            {isEdit ? "Edit User" : "User Registration Form"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <div className="p-6 space-y-6">
          <form onSubmit={userHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input type="text" name="firstName" value={user.firstName} onChange={handleInputChange} placeholder="Enter first name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input type="text" name="lastName" value={user.lastName} onChange={handleInputChange} placeholder="Enter last name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" name="email" value={user.email} onChange={handleInputChange} placeholder="Enter email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password {isEdit && <span className="text-gray-400">(leave blank to keep)</span>}
                </label>
                <input type="password" name="password" value={user.password} onChange={handleInputChange} placeholder={isEdit ? "Leave blank to keep current" : "Enter password"} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={user.dateOfBirth} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <input type="radio" name="gender" value="male" id="male" checked={user.gender === "male"} onChange={handleInputChange} />
                  <label htmlFor="male" className="text-sm">Male</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="gender" value="female" id="female" checked={user.gender === "female"} onChange={handleInputChange} />
                  <label htmlFor="female" className="text-sm">Female</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input type="tel" name="mobileNumber" value={user.mobileNumber} onChange={handleInputChange} placeholder="Enter mobile number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-medium">Address</label>
              <input type="text" name="addressLine1" value={user.addressLine1} onChange={handleInputChange} placeholder="Address Line 1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
              <input type="text" name="addressLine2" value={user.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="city" value={user.city} onChange={handleInputChange} placeholder="City" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
                <input type="text" name="state" value={user.state} onChange={handleInputChange} placeholder="State" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
                <input type="text" name="pincode" value={user.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select name="role" value={user.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black">
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="head">Head</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition disabled:opacity-50">
              {loading ? "Saving..." : isEdit ? "Update User" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
