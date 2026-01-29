import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function StudentForm() {
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    background: "",
    educationList: [{ qualification: "", stream: "", year: "" }],
    parentName: "",
    parentPhone: "",
  });

  const [studentList, setStudentList] = useState([]);

  const addEducation = () => {
    setStudent({
      ...student,
      educationList: [
        ...student.educationList,
        { qualification: "", stream: "", year: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    setStudent({
      ...student,
      educationList: student.educationList.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleEducationChange = (idx, field, value) => {
    const updatedEducationList = [...student.educationList];
    updatedEducationList[idx] = {
      ...updatedEducationList[idx],
      [field]: value,
    };
    setStudent({ ...student, educationList: updatedEducationList });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submitted Student Data:", student);
    setStudentList([...studentList, student]);
    setStudent({
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      mobileNumber: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      background: "",
      educationList: [{ qualification: "", stream: "", year: "" }],
      parentName: "",
      parentPhone: "",
    });
  };



  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="pb-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Student Registration Form
          </h2>
        </div>

        <div className="space-y-10 p-6">
          <form onSubmit={submitHandler}>
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
                    value={student.firstName}
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
                    value={student.lastName}
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
                    value={student.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
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
                    value={student.dateOfBirth}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      id="male"
                      checked={student.gender === "male"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="male" className="text-sm font-medium text-gray-700">
                      Male
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      id="female"
                      checked={student.gender === "female"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="female" className="text-sm font-medium text-gray-700">
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
                  value={student.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="10 digit mobile number"
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
                  name="address"
                  value={student.address}
                  onChange={handleInputChange}
                  placeholder="House No, Street, Area"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
                <input
                  type="text"
                  name="landmark"
                  value={student.landmark}
                  onChange={handleInputChange}
                  placeholder="Landmark (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={student.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    name="state"
                    value={student.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    name="pincode"
                    value={student.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>
            </section>

            {/* BACKGROUND */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Technical Background
              </h3>

              <select
                name="background"
                value={student.background}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
              >
                <option value="">Select background</option>
                <option value="tech">Tech</option>
                <option value="non-tech">Non Tech</option>
              </select>
            </section>

            {/* EDUCATION */}
            <section className="space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Education</h3>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {student.educationList.map((_, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-md p-4 bg-gray-50 hover:bg-white hover:shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Education {idx + 1}</p>

                    {student.educationList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-transparent hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Qualification"
                    value={student.educationList[idx].qualification}
                    onChange={(e) =>
                      handleEducationChange(idx, "qualification", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Specialization / Stream"
                    value={student.educationList[idx].stream}
                    onChange={(e) =>
                      handleEducationChange(idx, "stream", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Passing Year"
                    value={student.educationList[idx].year}
                    onChange={(e) =>
                      handleEducationChange(idx, "year", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              ))}
            </section>

            {/* PARENT */}
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Parent Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="parentName"
                  value={student.parentName}
                  onChange={handleInputChange}
                  placeholder="Parent Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
                <input
                  type="tel"
                  name="parentPhone"
                  value={student.parentPhone}
                  onChange={handleInputChange}
                  placeholder="Parent Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>
            </section>

            {/* SUBMIT */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-11 text-base border border-gray-300 rounded-md bg-white text-gray-900 font-medium hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
              >
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
