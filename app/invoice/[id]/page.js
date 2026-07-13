// app/invoice/[id]/page.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InvoicePerId({ params }) {
  const { id } = await params;
  
  const response = await fetch(`http://localhost:8080/api/sales/${id}`);
  const data = await response.json();
  
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Invoice #{id}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}