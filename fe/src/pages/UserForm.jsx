import React, { useState } from "react";

export function UserForm() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
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

  const [userData, setUserData] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const userHandler = (e) => {
    e.preventDefault();
    console.log("Submitted User Data:", user);
    setUserData([...userData, user]);
    setUser({
      firstName: "",
      lastName: "",
      email: "",
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
      <div className="w-full max-w-2xl border border-black rounded-lg">
        <div className="border-b border-black p-6">
          <h2 className="text-2xl font-semibold text-center">
            User Registration Form
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={userHandler}>
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Email & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={user.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    id="male"
                    checked={user.gender === "male"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="male" className="text-sm">
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
                  <label htmlFor="female" className="text-sm">
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={user.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <label className="block text-lg font-medium">Address</label>
              <input
                type="text"
                name="addressLine1"
                value={user.addressLine1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="text"
                name="addressLine2"
                value={user.addressLine2}
                onChange={handleInputChange}
                placeholder="Address Line 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  value={user.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  type="text"
                  name="state"
                  value={user.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  type="text"
                  name="pincode"
                  value={user.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={user.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
            >
              Submit
            </button>
          </form>

          {/* User List */}
          {/* <div className="mt-10 border-t border-gray-300 pt-6">
            <h3 className="text-lg font-semibold mb-4">Registered Users</h3>
            {userData.length === 0 ? (
              <p className="text-gray-500">No users registered yet.</p>
            ) : (
              <div className="space-y-4">
                {userData.map((item, i) => (
                  <div
                    key={i}
                    className="border-2 border-gray-300 p-4 rounded-md bg-gray-50"
                  >
                    <p>
                      <strong>Name:</strong> {item.firstName} {item.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {item.mobileNumber}
                    </p>
                    <p>
                      <strong>Gender:</strong> {item.gender}
                    </p>
                    <p>
                      <strong>Role:</strong> {item.role}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
