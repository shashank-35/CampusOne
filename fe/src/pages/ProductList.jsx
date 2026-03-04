import React, { use, useEffect, useState } from "react";
import {
  Search, Plus, Download, Trash2, Edit, Eye, X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const API = "http://localhost:5000/api";
const StatusBadge = ({ status }) => {
  const styles = {
    "in-stock": "bg-green-100 text-green-700",
    "low-stock": "bg-yellow-100 text-yellow-700",
    "out-of-stock": "bg-red-100 text-red-700",
  };
  const labels = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // TODO: Add fetchProducts function with API call
const fetchProducts = async () => {
    setLoading(true);
   const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
   axios.get(`${API}/products`, { params: { search: searchTerm }, headers })
     .then((res) => setProducts(res.data.data || []))
     .catch(() => setProducts([]))
     .finally(() => setLoading(false));
  };


  // TODO: Add useEffect to fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    // TODO: Add API delete call
    try {
      await axios.delete(`${API}/products/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      fetchProducts();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your product inventory and stock levels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700">
            <Download className="h-4 w-4" /> Export
          </button>
          <Link to="/product/create">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                  <input type="checkbox" checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} onChange={toggleSelectAll} className="w-4 h-4 cursor-pointer" />
                </th>
                <th className="p-4">PRODUCT NAME</th>
                <th className="p-4">RECEIVED</th>
                <th className="p-4">MISSING</th>
                <th className="p-4">AVAILABLE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="group hover:bg-blue-50/50 transition-colors">
                    <td className="p-4">
                      <input type="checkbox" checked={selectedProducts.includes(product._id)} onChange={() => toggleSelectProduct(product._id)} className="w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {product.productName.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900">{product.productName}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{product.receiveCount}</td>
                    <td className="p-4 text-red-600 font-medium">{product.missing}</td>
                    <td className="p-4 text-green-600 font-medium">{product.availableCount}</td>
                    <td className="p-4"><StatusBadge status={product.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedProduct(product); setViewDialogOpen(true); }} className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => navigate(`/product/edit/${product._id}`)} className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Showing {filteredProducts.length} products
        </div>
      </div>

      {viewDialogOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              <button onClick={() => setViewDialogOpen(false)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedProduct.productName.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.productName}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Received</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedProduct.receiveCount}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Missing</p>
                  <p className="text-sm font-semibold text-red-600">{selectedProduct.missing}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Available</p>
                  <p className="text-sm font-semibold text-green-600">{selectedProduct.availableCount}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                  <StatusBadge status={selectedProduct.status} />
                </div>
              </div>
              {selectedProduct.description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Description</p>
                  <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <button onClick={() => { setViewDialogOpen(false); navigate(`/product/edit/${selectedProduct._id}`); }} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">Edit</button>
                <button onClick={() => setViewDialogOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
