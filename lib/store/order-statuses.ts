/** Order pipeline. Kept free of server imports so the admin's client form can use it too. */
export const ORDER_STATUSES = [
  { id: "awaiting_payment", label: "Awaiting payment" },
  { id: "new", label: "New (payment to arrange)" },
  { id: "booking_paid", label: "Booking paid" },
  { id: "paid", label: "Paid in full" },
  { id: "processing", label: "Processing" },
  { id: "delivered", label: "Delivered" },
  { id: "installed", label: "Installed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "refunded", label: "Refunded" },
] as const;
export const orderStatusLabel = (id: string) => ORDER_STATUSES.find((s) => s.id === id)?.label ?? id;
