import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export  function ProductForm() {
  const [formData, setFormData] = useState({
    productName: "",
    receiveCount: "",
    missing: "",
    availableCount: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
      <Card className="w-full max-w-xl border border-black">
        <CardHeader>
          <CardTitle className="text-center text-xl">Product Stock Form</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <Label>Product Name</Label>
              <Input
                name="productName"
                placeholder="Enter product name"
                onChange={handleChange}
              />
            </div>

            {/* Receive Count */}
            <div>
              <Label>Receive Count</Label>
              <Input
                type="number"
                name="receiveCount"
                placeholder="Enter received quantity"
                onChange={handleChange}
              />
            </div>

            {/* Missing */}
            <div>
              <Label>Missing</Label>
              <Input
                type="number"
                name="missing"
                placeholder="Enter missing count"
                onChange={handleChange}
              />
            </div>

            {/* Available Count */}
            <div>
              <Label>Available Count</Label>
              <Input
                type="number"
                name="availableCount"
                placeholder="Enter available count"
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                placeholder="Enter product description"
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Save Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
