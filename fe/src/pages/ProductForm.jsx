import { useState } from "react";

export function ProductForm() {
  const [product, setProduct] = useState({
    productName: "",
    receiveCount: "",
    missing: "",
    availableCount: "",
    description: "",
  });

  const [productList, setProductList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Product Data:", product);
    setProductList([...productList, product]);
    setProduct({
      productName: "",
      receiveCount: "",
      missing: "",
      availableCount: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-2xl bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="pb-4 border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Product Stock Form
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Receive Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receive Count
              </label>
              <input
                type="number"
                name="receiveCount"
                value={product.receiveCount}
                onChange={handleChange}
                placeholder="Enter received quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Missing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Missing
              </label>
              <input
                type="number"
                name="missing"
                value={product.missing}
                onChange={handleChange}
                placeholder="Enter missing count"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Available Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Count
              </label>
              <input
                type="number"
                name="availableCount"
                value={product.availableCount}
                onChange={handleChange}
                placeholder="Enter available count"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 text-base border border-gray-300 rounded-md bg-white text-gray-900 font-medium hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
            >
              Save Product
            </button>
          </form>

          {/* Product List */}
          {/* <div className="mt-10 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Products Added</h3>
            {productList.length === 0 ? (
              <p className="text-gray-500">No products added yet.</p>
            ) : (
              <div className="space-y-4">
                {productList.map((prod, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-md p-4 bg-gray-50 hover:bg-white hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-800">
                      {prod.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Receive Count: {prod.receiveCount}
                    </p>
                    <p className="text-sm text-gray-600">Missing: {prod.missing}</p>
                    <p className="text-sm text-gray-600">
                      Available: {prod.availableCount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Description: {prod.description}
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
