/** Nhãn hiển thị trạng thái đơn — khớp chuỗi backend (vd. PENDING). */
export function orderStatusLabelVi(status: string): string {
  const u = String(status || '').toUpperCase();
  const map: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đã gửi hàng',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  };
  return map[u] || status;
}

/** Trạng thái thanh toán (UNPAID, PAID, …). */
export function paymentStatusLabelVi(value: unknown): string {
  const key = String(value ?? '').trim().toUpperCase();
  if (!key) return 'Chưa có trạng thái thanh toán';
  const labels: Record<string, string> = {
    UNPAID: 'Chưa thanh toán',
    PENDING: 'Đang chờ thanh toán',
    PAID: 'Đã thanh toán',
    FAILED: 'Thanh toán thất bại',
    CANCELLED: 'Đã hủy thanh toán',
    EXPIRED: 'Hết hạn thanh toán',
  };
  return labels[key] ?? key;
}

function isCodMethodRaw(value: unknown): boolean {
  const u = String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');
  return u === 'COD' || u === 'CASH_ON_DELIVERY';
}

/**
 * Nhãn thanh toán gắn với đơn: COD + UNPAID khi chưa giao không hiển thị như "chưa thanh toán"
 * (vì tiền thu lúc nhận hàng). Khi đã giao + PAID: "đã thanh toán khi nhận hàng".
 */
export function codAwarePaymentStatusVi(input: {
  paymentMethod?: unknown;
  paymentStatus?: unknown;
  orderStatus?: unknown;
}): string {
  const isCod = isCodMethodRaw(input.paymentMethod);
  const ps = String(input.paymentStatus ?? '')
    .trim()
    .toUpperCase();
  const st = String(input.orderStatus ?? '')
    .trim()
    .toUpperCase();

  if (!isCod) {
    return paymentStatusLabelVi(input.paymentStatus);
  }

  if (st === 'CANCELLED') {
    return paymentStatusLabelVi(input.paymentStatus);
  }

  if (ps === 'PAID') {
    if (st === 'DELIVERED') {
      return 'Đã thanh toán khi nhận hàng';
    }
    return 'Đã thanh toán (COD)';
  }

  if (st === 'DELIVERED' && ps === 'UNPAID') {
    return 'Đã giao — thanh toán COD (chưa cập nhật PAID trên server)';
  }

  if (ps === 'UNPAID' || ps === 'PENDING' || !ps) {
    return 'Trả tiền mặt khi nhận hàng (chưa giao)';
  }

  return paymentStatusLabelVi(input.paymentStatus);
}

/** Phương thức thanh toán từ backend (ưu tiên COD). */
export function paymentMethodLabelVi(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '—';
  const u = raw.toUpperCase().replace(/\s+/g, '_');
  const map: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng (COD)',
    CASH_ON_DELIVERY: 'Thanh toán khi nhận hàng (COD)',
    VNPAY: 'VNPay',
    ZALOPAY: 'ZaloPay',
    CARD: 'Thẻ ngân hàng',
    CREDIT_CARD: 'Thẻ tín dụng / ghi nợ',
    DEBIT_CARD: 'Thẻ ghi nợ',
    BANK_TRANSFER: 'Chuyển khoản ngân hàng',
    PAYPAL: 'PayPal',
  };
  return map[u] ?? raw;
}

