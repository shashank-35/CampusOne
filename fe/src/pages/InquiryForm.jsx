import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import  axios from "axios";

const API = "http://localhost:5000/api";

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
    // assignTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios.get(`${API}/inquiries/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((res) => {
          const s = res.data.data;
          setInquiry({
            sourceOfInquiry: s.sourceOfInquiry || "",
            firstName: s.firstName || "",
            lastName: s.lastName || "",
            email: s.email || "",
            dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split("T")[0] : "",
            gender: s.gender || "male",
            mobile: s.mobile || "",
            addressLine1: s.addressLine1 || "",
            addressLine2: s.addressLine2 || "",
            city: s.city || "",
            state: s.state || "",
            pincode: s.pincode || "",
            techBackground: s.techBackground || "",
            qualification: s.qualification || "",
            specialization: s.specialization || "",
            passingYear: s.passingYear || "",
            interestedArea: s.interestedArea || "",
          });
        })
        .catch((err) => setError(err.response?.data?.message || "Failed to load inquiry"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      if (isEdit) {
        await axios.put(`${API}/inquiries/${id}`, inquiry, { headers });
      } else {
        await axios.post(`${API}/inquiries`, inquiry, { headers });
      }
      navigate("/inquiry");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="pb-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {isEdit ? "Edit Inquiry" : "Inquiry Form"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-10 p-6">
          <form onSubmit={handleSubmit}>
            {/* SOURCE */}
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Inquiry Source
              </h3>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Source of Inquiry
                </label>
                <select
                  value={inquiry.sourceOfInquiry}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, sourceOfInquiry: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                >
                  <option value="">Select source</option>
                  <option value="website">Website</option>
                  <option value="reference">Reference</option>
                  <option value="social">Social Media</option>
                </select>
              </div>
            </section>

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
                    value={inquiry.firstName}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, firstName: e.target.value })
                    }
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
                    value={inquiry.lastName}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, lastName: e.target.value })
                    }
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
                    value={inquiry.email}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, email: e.target.value })
                    }
                    placeholder="example@mail.com"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={inquiry.dateOfBirth}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, dateOfBirth: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="flex gap-6">
                  {["male", "female", "other"].map((g) => (
                    <div key={g} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={g}
                        name="gender"
                        value={g}
                        checked={inquiry.gender === g}
                        onChange={(e) =>
                          setInquiry({ ...inquiry, gender: e.target.value })
                        }
                      />
                      <label
                        htmlFor={g}
                        className="text-sm font-medium text-gray-700 capitalize"
                      >
                        {g}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={inquiry.mobile}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, mobile: e.target.value })
                  }
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
                  value={inquiry.addressLine1}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, addressLine1: e.target.value })
                  }
                  placeholder="Address Line 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
                <input
                  type="text"
                  value={inquiry.addressLine2}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, addressLine2: e.target.value })
                  }
                  placeholder="Address Line 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={inquiry.city}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, city: e.target.value })
                    }
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    value={inquiry.state}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, state: e.target.value })
                    }
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                  <input
                    type="text"
                    value={inquiry.pincode}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, pincode: e.target.value })
                    }
                    placeholder="Pincode"
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
                value={inquiry.techBackground}
                onChange={(e) =>
                  setInquiry({ ...inquiry, techBackground: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
              >
                <option value="">Select background</option>
                <option value="tech">Tech</option>
                <option value="non-tech">Non Tech</option>
              </select>
            </section>

            {/* EDUCATION */}
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Education Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={inquiry.qualification}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, qualification: e.target.value })
                    }
                    placeholder="e.g. BSc, BTech"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={inquiry.specialization}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, specialization: e.target.value })
                    }
                    placeholder="e.g. Computer Science"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Passing Year
                  </label>
                  <input
                    type="number"
                    value={inquiry.passingYear}
                    onChange={(e) =>
                      setInquiry({ ...inquiry, passingYear: e.target.value })
                    }
                    placeholder="2024"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>
            </section>

            {/* INTERESTED AREA */}
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Interest
              </h3>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Interested Area
                </label>
                <input
                  type="text"
                  value={inquiry.interestedArea}
                  onChange={(e) =>
                    setInquiry({ ...inquiry, interestedArea: e.target.value })
                  }
                  placeholder="Web Development, Data Science, etc."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>
            </section>

            {/* SUBMIT */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base border border-gray-300 rounded-md text-white font-medium bg-[var(--theme-button-color)] hover:bg-[var(--theme-background-color)] transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Inquiry"
                    : "Submit Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
