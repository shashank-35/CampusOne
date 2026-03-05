import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const API = "http://localhost:5000/api";
export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [product, setProduct] = useState({
    productName: "",
    receiveCount: "",
    missing: "",
    availableCount: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Add useEffect to fetch product by id when isEdit is true
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios.get(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          const data = res.data.data;
          setProduct({
            productName: data.productName || "",
            receiveCount: data.receiveCount || "",
            missing: data.missing || "",
            availableCount: data.availableCount || "",
            description: data.description || "",
          });
        })
        .catch(() => setError("Failed to load product data"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // TODO: Add API call in handleSubmit

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Form data:", product);
    try{
      const header = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      if (isEdit) {
        await axios.put(`${API}/products/${id}`, product, { headers: header });
        
      }else {
        await axios.post(`${API}/products`, product, { headers: header });
      }
      navigate("/product");
    }
    catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="pb-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {isEdit ? "Edit Product" : "Product Stock Form"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-10 p-6">
          <form onSubmit={handleSubmit}>
            <section className="space-y-5">
              <h3 className="text-lg font-medium text-gray-700">
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={product.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Receive Count
                  </label>
                  <input
                    type="number"
                    name="receiveCount"
                    value={product.receiveCount}
                    onChange={handleChange}
                    placeholder="Enter received quantity"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Missing
                  </label>
                  <input
                    type="number"
                    name="missing"
                    value={product.missing}
                    onChange={handleChange}
                    placeholder="Enter missing count"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                    Available Count
                  </label>
                  <input
                    type="number"
                    name="availableCount"
                    value={product.availableCount}
                    onChange={handleChange}
                    placeholder="Enter available count"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 group-hover:text-black">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
                />
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base border border-gray-300 rounded-md text-white font-medium bg-[var(--theme-button-color)] hover:bg-[var(--theme-background-color)] transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Product"
                    : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
