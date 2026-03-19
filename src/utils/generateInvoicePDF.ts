export type GenerateInvoicePDFInput = {
  orderId?: string;
};

/**
 * Placeholder PDF generator.
 * For now we just open the browser print dialog, so the UI can be wired early.
 */
export async function generateInvoicePDF(_input?: GenerateInvoicePDFInput): Promise<void> {
  // In future, replace with real PDF generation (server-side or client-side).
  window.print();
}

