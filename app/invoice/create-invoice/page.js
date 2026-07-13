"use client";

// app/invoice/[id]/page.js
import { useState } from "react";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InvoicePerId({ params }) {
  const [formData, setFormData] = useState({
    customerName: "",
    description: "",
    quantity: "",
    price: "",
    total: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          invoiceId: params.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit invoice");
      }

      const data = await response.json();
      setMessage("Invoice submitted successfully!");
      console.log("Success:", data);
      
      setFormData({
        customerName: "",
        description: "",
        quantity: "",
        price: "",
        total: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to submit invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ REMOVE <html> and <body> - they're already provided by layout
    <div className="min-h-full flex flex-col p-30">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <Input
            className="w-100 h-10"
            placeholder="Enter Customer Name"
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
          <Input
            className="w-100 h-10"
            placeholder="Enter Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <Input
            className="w-100 h-10"
            placeholder="Enter Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <Input
            className="w-100 h-10"
            placeholder="Enter Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <Input
            className="w-100 h-10"
            placeholder="Enter Total"
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            required
          />
          <Button
            className="w-100 h-10"
            variant="secondary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}