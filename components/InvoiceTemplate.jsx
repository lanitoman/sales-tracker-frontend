// components/InvoiceTemplate.jsx
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function InvoiceTemplate({ invoice }) {
  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-muted-foreground">No invoice data available</p>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Use lines from API or show sample items
  const items = invoice.lines && invoice.lines.length > 0 ? invoice.lines : [
    { description: "No items added", qty: 0, unitCost: 0, total: 0 }
  ];

  // Calculate totals
  const subtotal = invoice.lines?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardContent className="p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">INVOICE</h1>
              <p className="text-muted-foreground text-sm mt-1">#{invoice.id?.slice(0, 8) || 'N/A'}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="font-semibold text-foreground">Your Company Name</p>
              <p className="text-muted-foreground text-sm">123 Business St, City</p>
              <p className="text-muted-foreground text-sm">your@email.com</p>
            </div>
          </div>

          {/* Customer & Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted rounded-lg p-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Bill To</p>
              <p className="text-lg font-semibold text-foreground">{invoice.customer || 'N/A'}</p>
              <p className="text-muted-foreground text-sm">Customer</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Invoice Details</p>
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Date: </span>
                {formatDate(invoice.issueDate)}
              </p>
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Reference: </span>
                {invoice.ref || 'N/A'}
              </p>
            </div>
          </div>

          {/* Description */}
          {invoice.description && (
            <div className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Description: </span>
                {invoice.description}
              </p>
            </div>
          )}

          {/* Items Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit Cost</th>
                  <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 text-foreground">{item.description || 'N/A'}</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">{item.qty || 0}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">
                      ${(item.unitCost || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-foreground">
                      ${(item.total || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-72">
              <div className="flex justify-between py-2 text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-muted-foreground text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 mt-2 border-t-2 border-border text-foreground font-bold text-lg">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border px-8 py-4">
          <p className="text-muted-foreground text-sm w-full text-center">
            Payment due within 30 days. Thank you for your business!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default InvoiceTemplate;