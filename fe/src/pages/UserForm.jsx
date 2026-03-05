import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
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
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios.get(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

        .then((res) => {
          const userData = res.data.data;
          setUser({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            password: "",
            dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split("T")[0] : "",
            gender: userData.gender || "",
            mobileNumber: userData.mobileNumber || "",
            addressLine1: userData.address?.line1 || "",
            addressLine2: userData.address?.line2 || "",
            city: userData.address?.city || "",
            state: userData.address?.state || "",
            pincode: userData.address?.pincode || "",
            role: userData.role || "",
          });
        }
        )
        .catch(() => setError("Failed to load user data"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // TODO: Add API call in userHandler

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const userHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Form data:", user);
try {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    if (isEdit) {
      const res = await axios.put(`${API}/users/${id}`, user, { headers });
    }else {

     await axios.post(`${API}/users`, user, { headers });
    }
    navigate("/user");
  } catch (err) {
    setError(err.response?.data?.message || "An error occurred");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="pb-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {isEdit ? "Edit User" : "User Registration Form"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-10 p-6">
          <form onSubmit={userHandler}>
            {/* BASIC INFO */}
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Password{" "}
                    {isEdit && (
                      <span className="text-gray-400">(leave blank to keep)</span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    placeholder={
                      isEdit ? "Leave blank to keep current" : "Enter password"
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={user.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      id="male"
                      checked={user.gender === "male"}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="male"
                      className="text-sm font-medium text-gray-700"
                    >
                      Male
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      id="female"
                      checked={user.gender === "female"}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="female"
                      className="text-sm font-medium text-gray-700"
                    >
                      Female
                    </label>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={user.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>
            </section>

            {/* ADDRESS */}
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">Address</h3>
              <div className="p-5 border border-gray-200 rounded-md bg-gray-50 hover:bg-white hover:shadow-sm space-y-4">
                <input
                  type="text"
                  name="addressLine1"
                  value={user.addressLine1}
                  onChange={handleInputChange}
                  placeholder="Address Line 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
                <input
                  type="text"
                  name="addressLine2"
                  value={user.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Address Line 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={user.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    name="state"
                    value={user.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    name="pincode"
                    value={user.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>
            </section>

            {/* ROLE */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Role
              </h3>
              <select
                name="role"
                value={user.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="head">Head</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>
            </section>

            {/* SUBMIT */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base border border-gray-300 rounded-md text-white font-medium bg-[var(--theme-button-color)] hover:bg-[var(--theme-background-color)] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : isEdit ? "Update User" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
