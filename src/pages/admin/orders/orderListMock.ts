/**
 * Mock dữ liệu Order List (admin) — thay bằng API khi có backend.
 */

export type OrderStatus =
  | 'Completed'
  | 'Processing'
  | 'Rejected'
  | 'On Hold'
  | 'In Transit';

/** Các chip trong popup "Select Order Type" */
export const ORDER_TYPE_OPTIONS = [
  'Health & Medicine',
  'Book & Stationary',
  'Services & Industry',
  'Fashion & Beauty',
  'Home & Living',
  'Electronics',
  'Mobile & Phone',
  'Accessories',
] as const;

export type OrderTypeOption = (typeof ORDER_TYPE_OPTIONS)[number];

export type AdminOrderRow = {
  id: string;
  name: string;
  address: string;
  /** Ngày đơn (local date) */
  date: Date;
  /** Hiển thị cột TYPE (Electric, Book, …) */
  typeLabel: string;
  /** Một hoặc nhiều chip type khớp khi lọc */
  typeKeys: OrderTypeOption[];
  status: OrderStatus;
};

const NAMES = [
  'Christine Brooks',
  'Rosie Pearson',
  'Darrell Caldwell',
  'Lonnie Corwin',
  'Leopoldo Goyette',
  'Eileen Mante',
  'Kristen Orn',
  'Marvin Bernier',
  'Michele Bogisich',
  'Howard Veum',
  'Patricia Lebsack',
  'Chelsey Dietrich',
  'Mrs. Dennis Schulist',
  'Kurtis Weissnat',
  'Nicholas Runolfsdottir V',
  'Glenna Reichert',
  'Clementina DuBuque',
  'Tanya Reichert',
  'Jordane Schmeler',
  'Ewald Rohan',
];

const ADDRESSES = [
  '089 Kutch Green Apt. 448',
  '042 Mylene Throughway',
  '543 Weimann Mountain',
  '912 Kirlin Inlet',
  '722 Emard Stream',
  '330 Ondricka Hollow',
  '195 Bahringer Oval',
  '667 Mohr Village',
  '812 Barrows Mountain',
  '088 Carissa Ridge',
  '123 Maple Street',
  '456 Oak Avenue',
  '789 Pine Road',
  '321 Elm Court',
  '654 Cedar Lane',
];

/** Map chip → nhãn TYPE hiển thị (đơn giản, mock) */
const TYPE_KEY_LABEL: Record<OrderTypeOption, string> = {
  'Health & Medicine': 'Medicine',
  'Book & Stationary': 'Book',
  'Services & Industry': 'Electric',
  'Fashion & Beauty': 'Watch',
  'Home & Living': 'Electric',
  'Electronics': 'Electric',
  'Mobile & Phone': 'Mobile',
  'Accessories': 'Watch',
};

const STATUSES: OrderStatus[] = [
  'Completed',
  'Processing',
  'Rejected',
  'On Hold',
  'In Transit',
];

const TYPE_ROTATION: OrderTypeOption[][] = [
  ['Electronics'],
  ['Book & Stationary'],
  ['Health & Medicine'],
  ['Mobile & Phone'],
  ['Accessories'],
  ['Services & Industry'],
  ['Fashion & Beauty'],
  ['Home & Living'],
];

/** Tạo 78 đơn, ID 00001… — đủ ngày để thử Prev/Next Date */
function buildMockOrders(): AdminOrderRow[] {
  const out: AdminOrderRow[] = [];
  /** Một số đơn quanh 14 Feb 2019 như mockup */
  const start = new Date(2019, 1, 14);

  for (let i = 0; i < 78; i++) {
    const dayOffset = Math.floor(i / 3) * 2 + (i % 5);
    const d = new Date(start);
    d.setDate(d.getDate() + dayOffset);

    const typeKeys = TYPE_ROTATION[i % TYPE_ROTATION.length];
    const typeLabel = TYPE_KEY_LABEL[typeKeys[0]];
    const status = STATUSES[i % STATUSES.length];

    out.push({
      id: String(i + 1).padStart(5, '0'),
      name: NAMES[i % NAMES.length],
      address: ADDRESSES[i % ADDRESSES.length],
      date: d,
      typeLabel,
      typeKeys,
      status,
    });
  }

  return out;
}

export const MOCK_ADMIN_ORDERS: AdminOrderRow[] = buildMockOrders();

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Completed',
  'Processing',
  'Rejected',
  'On Hold',
  'In Transit',
];

/** Nhãn tiếng Việt cho chip trạng thái mock — giữ giá trị gốc để lọc. */
export function mockOrderStatusLabelVi(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    Completed: 'Hoàn thành',
    Processing: 'Đang xử lý',
    Rejected: 'Từ chối',
    'On Hold': 'Tạm giữ',
    'In Transit': 'Đang vận chuyển',
  };
  return map[status] ?? status;
}

/** Nhãn tiếng Việt cho loại đơn mock — giữ giá trị gốc để lọc. */
export function mockOrderTypeOptionLabelVi(type: OrderTypeOption): string {
  const map: Record<OrderTypeOption, string> = {
    'Health & Medicine': 'Sức khỏe & Dược phẩm',
    'Book & Stationary': 'Sách & văn phòng phẩm',
    'Services & Industry': 'Dịch vụ & Công nghiệp',
    'Fashion & Beauty': 'Thời trang & Làm đẹp',
    'Home & Living': 'Nhà cửa & Đời sống',
    Electronics: 'Điện tử',
    'Mobile & Phone': 'Di động & Điện thoại',
    Accessories: 'Phụ kiện',
  };
  return map[type] ?? type;
}
