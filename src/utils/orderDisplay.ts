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
