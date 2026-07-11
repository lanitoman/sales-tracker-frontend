"use client"

import * as React from "react"
import {
  ArrowLeft,
  Printer,
  Download,
  Pencil,
  MoreVertical,
  Building2,
  User,
  Gem,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Hallmark-style status stamp
// A jewellery assay office stamps a hallmark to certify a piece — here it
// certifies the invoice's payment state. Concentric ring + center glyph
// stands in for the generic status "pill" you'd see on any other app.
// ---------------------------------------------------------------------------
const STAMP_CONFIG = {
  paid: { glyph: "P", label: "Paid", color: "#3FAE6B" },
  due: { glyph: "D", label: "Awaiting payment", color: "#C9A34A" },
  overdue: { glyph: "O", label: "Overdue", color: "#D9534F" },
  draft: { glyph: "—", label: "Draft", color: "#8D9199" },
}

function HallmarkStamp({ status = "due" }) {
  const cfg = STAMP_CONFIG[status] ?? STAMP_CONFIG.due
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px]"
        style={{ borderColor: cfg.color, color: cfg.color }}
      >
        <div
          className="absolute inset-[3px] rounded-full border"
          style={{ borderColor: cfg.color, opacity: 0.45 }}
        />
        <span className="font-mono text-xs font-semibold tracking-tight">
          {cfg.glyph}
        </span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-medium" style={{ color: cfg.color }}>
          {cfg.label}
        </p>
        <p className="text-[11px] text-muted-foreground">Invoice status</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sample data shape — replace with your real invoice payload.
// ---------------------------------------------------------------------------
const sampleInvoice = {
  invoiceNumber: "INV-2026-0417",
  status: "due", // "paid" | "due" | "overdue" | "draft"
  issueDate: "2026-07-02",
  dueDate: "2026-07-16",
  currency: "AED",
  company: {
    name: "Al Shafa Jewellery LLC",
    address: "Gold Souk, Deira, Dubai, UAE",
    trn: "TRN 10023 4456 7",
    email: "accounts@alshafajewellery.ae",
  },
  customer: {
    name: "Fatima Al Marri",
    address: "Villa 22, Al Barsha 2, Dubai, UAE",
    email: "fatima.marri@example.com",
  },
  items: [
    { id: "1", name: "22K Gold Necklace — Rani Haar", qty: 1, rate: 18450 },
    { id: "2", name: "Diamond Solitaire Ring, 0.85ct", qty: 1, rate: 24900 },
    { id: "3", name: "18K Gold Bangles (pair)", qty: 2, rate: 5320 },
    { id: "4", name: "Making charges", qty: 1, rate: 1200 },
  ],
  discount: 1500,
  taxRate: 5,
  notes:
    "Thank you for your purchase. Items remain the property of Al Shafa Jewellery LLC until paid in full.",
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function InvoiceViewer({
  invoice = sampleInvoice,
  onBack,
  onEdit,
  onPrint,
  onDownload,
}) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  )
  const discount = invoice.discount ?? 0
  const taxable = subtotal - discount
  const tax = (taxable * invoice.taxRate) / 100
  const total = taxable + tax

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1.5 text-muted-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onPrint}
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onDownload}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button size="sm" className="gap-1.5" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate invoice</DropdownMenuItem>
              <DropdownMenuItem>Send reminder</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Void invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        {/* Header */}
        <CardHeader className="flex flex-col gap-6 border-b border-border/80 bg-muted/20 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-foreground/5">
              <Gem className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Sales invoice
              </p>
              <p className="font-mono text-xl font-semibold tracking-tight">
                {invoice.invoiceNumber}
              </p>
              <div className="mt-1.5 flex gap-4 font-mono text-xs text-muted-foreground">
                <span>Issued {formatDate(invoice.issueDate)}</span>
                <span>Due {formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>

          <HallmarkStamp status={invoice.status} />
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* Company / Customer */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Billed by
              </div>
              <p className="text-sm font-medium">{invoice.company.name}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.company.address}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {invoice.company.trn}
              </p>
            </div>
            <div className="sm:text-right">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:justify-end">
                <User className="h-3.5 w-3.5" />
                Billed to
              </div>
              <p className="text-sm font-medium">{invoice.customer.name}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.customer.address}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {invoice.customer.email}
              </p>
            </div>
          </div>

          <Separator />

          {/* Line items — ledger style */}
          <div className="overflow-hidden rounded-md border border-border/80">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-full">Item</TableHead>
                  <TableHead className="text-right font-mono">Qty</TableHead>
                  <TableHead className="text-right font-mono">Rate</TableHead>
                  <TableHead className="text-right font-mono">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {item.qty}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {formatMoney(item.rate, invoice.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium">
                      {formatMoney(item.qty * item.rate, invoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">
                  {formatMoney(subtotal, invoice.currency)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-mono">
                    −{formatMoney(discount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  VAT ({invoice.taxRate}%)
                </span>
                <span className="font-mono">
                  {formatMoney(tax, invoice.currency)}
                </span>
              </div>

              <div
                className="mt-3 flex items-center justify-between border-t-2 pt-3"
                style={{ borderColor: "#C9A34A" }}
              >
                <span className="text-sm font-semibold">Total due</span>
                <span className="font-mono text-lg font-semibold">
                  {formatMoney(total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        {invoice.notes && (
          <CardFooter className="border-t border-border/80 bg-muted/10 py-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {invoice.notes}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}