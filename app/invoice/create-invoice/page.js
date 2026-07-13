// app/invoice/create/page.js
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state matching your JSON structure
  const [formData, setFormData] = useState({
    customer: "",
    description: "",
    issueDate: new Date().toISOString().split('T')[0],
    ref: "",
    lines: [
      {
        itemName: "",
        qty: 1,
        unitCOst: 0
      }
    ]
  });

  // Add a new line item
  const addLine = () => {
    setFormData({
      ...formData,
      lines: [
        ...formData.lines,
        { itemName: "", qty: 1, unitCOst: 0 }
      ]
    });
  };

  // Remove a line item
  const removeLine = (index) => {
    if (formData.lines.length <= 1) {
      setError("You must have at least one line item");
      return;
    }
    const newLines = formData.lines.filter((_, i) => i !== index);
    setFormData({ ...formData, lines: newLines });
  };

  // Update line item
  const updateLine = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index][field] = value;
    setFormData({ ...formData, lines: newLines });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate total for display (optional)
  const calculateLineTotal = (line) => {
    return (line.qty || 0) * (line.unitCOst || 0);
  };

  const calculateGrandTotal = () => {
    return formData.lines.reduce((sum, line) => {
      return sum + (line.qty || 0) * (line.unitCOst || 0);
    }, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.customer.trim()) {
      setError("Customer name is required");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    if (!formData.issueDate) {
      setError("Issue date is required");
      setLoading(false);
      return;
    }

    // Filter out empty lines
    const filteredLines = formData.lines.filter(
      line => line.itemName && line.itemName.trim() !== ""
    );

    if (filteredLines.length === 0) {
      setError("At least one line item with name is required");
      setLoading(false);
      return;
    }

    // Prepare payload matching your JSON structure exactly
    const payload = {
      customer: formData.customer,
      description: formData.description,
      issueDate: formData.issueDate,
      ref: formData.ref || null,
      lines: filteredLines.map(line => ({
        itemName: line.itemName,
        qty: parseInt(line.qty) || 0,
        unitCOst: parseFloat(line.unitCOst) || 0
      }))
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch("http://localhost:8080/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to create invoice";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Success response:", data);
      
      setSuccess("Invoice created successfully!");
      
      // Reset form
      setFormData({
        customer: "",
        description: "",
        issueDate: new Date().toISOString().split('T')[0],
        ref: "",
        lines: [
          { itemName: "", qty: 1, unitCOst: 0 }
        ]
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/invoice/${data.id}`);
      }, 2000);

    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Invoice</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-400">
                  <strong>Error:</strong> {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-green-600 dark:text-green-400">
                  <strong>Success:</strong> {success}
                </div>
              )}

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name *</Label>
                  <Input
                    id="customer"
                    name="customer"
                    placeholder="Enter customer name"
                    value={formData.customer}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Enter invoice description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ref">Reference (Optional)</Label>
                  <Input
                    id="ref"
                    name="ref"
                    placeholder="Enter reference number"
                    value={formData.ref}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Line Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLine}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Line
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.lines.map((line, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border border-border rounded-lg">
                      <div className="col-span-12 md:col-span-5 space-y-1">
                        <Label className="text-xs">Item Name</Label>
                        <Input
                          placeholder="Enter item name"
                          value={line.itemName}
                          onChange={(e) => updateLine(index, "itemName", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="0"
                          value={line.qty}
                          onChange={(e) => updateLine(index, "qty", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <Label className="text-xs">Unit Cost</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={line.unitCOst}
                          onChange={(e) => updateLine(index, "unitCOst", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2 space-y-1">
                        <Label className="text-xs">Total</Label>
                        <Input
                          type="text"
                          value={`$${calculateLineTotal(line).toFixed(2)}`}
                          disabled
                          className="h-9 bg-muted"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLine(index)}
                          className="h-9 w-9 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-end">
                <div className="w-full md:w-72">
                  <div className="flex justify-between py-3 border-t-2 border-border text-lg font-bold">
                    <span>Grand Total</span>
                    <span>${calculateGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/invoice")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Invoice
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}