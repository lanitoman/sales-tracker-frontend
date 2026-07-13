// app/invoice/[id]/page.js
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { notFound } from "next/navigation";

export default async function InvoicePerId({ params }) {
  const { id } = await params;
  
  try {
    // Fetch from Spring Boot API
    const response = await fetch(`http://localhost:8080/api/sales/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const invoiceData = await response.json();
    
    // Pass data to template
    return <InvoiceTemplate invoice={invoiceData} />;
    
  } catch (error) {
    console.error("Error fetching invoice:", error);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-red-600 dark:text-red-400 font-semibold text-lg">Error Loading Invoice</h2>
          <p className="text-red-500 dark:text-red-300 mt-2">Could not fetch invoice #{id}</p>
          <p className="text-sm text-red-400 dark:text-red-400/70 mt-1">
            Make sure your Spring Boot server is running on localhost:8080
          </p>
          <p className="text-xs text-red-400 dark:text-red-400/50 mt-2">
            Error: {error.message}
          </p>
        </div>
      </div>
    );
  }
}