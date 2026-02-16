import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  X,
} from "lucide-react";
import { Link } from "react-router";

const StatusBadge = ({ status }) => {
  const styles = {
    "In Stock": "bg-green-100 text-green-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "Out of Stock": "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default function ProductList() {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  // Filtered products based on search
  const filteredProducts = productList.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((_, idx) => idx));
    }
  };

  const toggleSelectProduct = (idx) => {
    if (selectedProducts.includes(idx)) {
      setSelectedProducts(selectedProducts.filter((i) => i !== idx));
    } else {
      setSelectedProducts([...selectedProducts, idx]);
    }
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  const deleteProduct = (idx) => {
    setProductList(productList.filter((_, i) => i !== idx));
    setSelectedProducts(selectedProducts.filter((i) => i !== idx));
  };

  const getStatus = (available) => {
    const avail = parseInt(available) || 0;
    if (avail > 50) return "In Stock";
    if (avail > 0) return "Low Stock";
    return "Out of Stock";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your product inventory and stock levels.
          </p>
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

      {/* Filters & Search */}
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
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Filter</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="p-4">PRODUCT NAME</th>
                <th className="p-4">RECEIVED</th>
                <th className="p-4">MISSING</th>
                <th className="p-4">AVAILABLE</th>
                <th className="p-4">DESCRIPTION</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    <p className="text-lg">
                      {productList.length === 0
                        ? "No products added yet. Create a product from ProductForm."
                        : "No products match your search."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => {
                  const status = getStatus(product.availableCount);
                  return (
                    <tr key={idx} className="group hover:bg-blue-50/50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(idx)}
                          onChange={() => toggleSelectProduct(idx)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                            {product.productName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.productName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{product.receiveCount}</td>
                      <td className="p-4 text-red-600 font-medium">{product.missing}</td>
                      <td className="p-4 text-green-600 font-medium">
                        {product.availableCount}
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewProduct(product)}
                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-green-100 text-green-600 hover:text-green-700 transition">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(idx)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing 1-{Math.min(parseInt(itemsPerPage), filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredProducts.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Received</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredProducts.reduce(
                (sum, p) => sum + (parseInt(p.receiveCount) || 0),
                0
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Missing</p>
            <p className="text-2xl font-bold text-red-600">
              {filteredProducts.reduce(
                (sum, p) => sum + (parseInt(p.missing) || 0),
                0
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Available</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredProducts.reduce(
                (sum, p) => sum + (parseInt(p.availableCount) || 0),
                0
              )}
            </p>
          </div>
        </div>
      )}

      {/* View Product Dialog */}
      {viewDialogOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Details
              </h3>
              <button
                onClick={() => setViewDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedProduct.productName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedProduct.productName}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Received
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedProduct.receiveCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Missing
                  </p>
                  <p className="text-sm font-semibold text-red-600">
                    {selectedProduct.missing}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Available
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    {selectedProduct.availableCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Status
                  </p>
                  <p className="text-sm font-semibold">
                    <StatusBadge status={getStatus(selectedProduct.availableCount)} />
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Description
                </p>
                <p className="text-sm text-gray-700">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  Edit
                </button>
                <button
                  onClick={() => setViewDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
