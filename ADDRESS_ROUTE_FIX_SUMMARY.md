# Tóm Tắt Sửa Lỗi Trùng Lặp URL - Addresses Routes

## 🔴 Vấn Đề Ban Đầu

Cả trang **'Chọn địa chỉ khi Checkout'** và trang **'Quản lý địa chỉ trong Profile'** đều dùng chung đường dẫn `/#/addresses`. Điều này gây ra:
- ❌ Nhấn "Add New Address" trong Checkout bị điều hướng sai
- ❌ Phải reload trang mới hiển thị đúng
- ❌ Người dùng bị văng ra khỏi luồng thanh toán

---

## ✅ Giải Pháp Đã Thực Hiện

### 1. ✅ Phân Tách Routes

#### a) Route Quản Lý Địa Chỉ (Profile)
**File**: `src/routes/AppRoutes.tsx`

**Trước:**
```tsx
<Route path="/addresses" element={<SavedAddressesPage />} />
```

**Sau:**
```tsx
<Route path="/account/addresses" element={<SavedAddressesPage />} />
```

**Kết quả:**
- ✅ URL mới: `/#/account/addresses`
- ✅ Trang quản lý địa chỉ trong Profile

---

#### b) Route Checkout (Không Cần Tạo Mới)
- ✅ Checkout vẫn sử dụng route `/checkout` với step 1
- ✅ Không cần route riêng `/checkout/address` vì đã có modal

---

### 2. ✅ Tạo Modal Cho "Add New Address" Trong Checkout
**File**: `src/components/checkout/CheckoutStep1.tsx`

#### Thay Đổi:

**Trước:**
```tsx
<Link
  to="/addresses"
  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
>
  <span className="material-icons">add</span>
  Add New Address
</Link>
```

**Sau:**
```tsx
<button
  type="button"
  onClick={openModal}
  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
>
  <span className="material-icons">add</span>
  Add New Address
</button>
```

#### Modal Component:
- ✅ Form đầy đủ: Full Name, Phone, Street, Apartment, City, State, Zip Code, Country
- ✅ Address Type: Home, Office, Other
- ✅ Set as default checkbox
- ✅ Validation: Required fields
- ✅ Sau khi submit:
  - Address mới được thêm vào danh sách
  - Tự động chọn address vừa tạo
  - Modal tự động đóng
  - Không bị văng ra khỏi luồng thanh toán

#### Code Structure:
```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [form, setForm] = useState(defaultForm);

const openModal = useCallback(() => {
  setForm(defaultForm);
  setIsModalOpen(true);
}, []);

const handleSubmitAddress = useCallback((e: React.FormEvent) => {
  e.preventDefault();
  const newAddr: SavedAddress = { /* ... */ };
  setAddresses((prev) => [...prev, newAddr]);
  setSelectedAddressId(newAddr.id);
  updateCheckoutData({ selectedAddress: newAddr });
  closeModal();
}, [form, updateCheckoutData, closeModal]);
```

**Kết quả:**
- ✅ Modal mở ngay tại chỗ, không navigate
- ✅ Người dùng không bị văng ra khỏi luồng thanh toán
- ✅ UX mượt mà hơn

---

### 3. ✅ Cập Nhật Navigation Links

#### a) Account Sidebar
**File**: `src/constants/accountNavigation.ts`

**Trước:**
```tsx
{ label: 'Saved Addresses', icon: 'location_on', path: '/addresses' },
```

**Sau:**
```tsx
{ label: 'Saved Addresses', icon: 'location_on', path: '/account/addresses' },
```

**Kết quả:**
- ✅ Link "Saved Addresses" trong Sidebar trỏ đúng `/account/addresses`

---

#### b) Data Navigation Items
**File**: `src/data/index.ts`

**Trước:**
```tsx
{ label: 'Address Book', icon: 'location_on', path: '/addresses' },
```

**Sau:**
```tsx
{ label: 'Address Book', icon: 'location_on', path: '/account/addresses' },
```

**Kết quả:**
- ✅ Navigation items trong data được cập nhật

---

### 4. ✅ Đảm Bảo Không Dùng window.location.href

**Kiểm tra:**
- ✅ Tất cả navigation đều dùng `<Link>` từ `react-router-dom`
- ✅ Không có `window.location.href` trong code
- ✅ Không có `window.location.reload()`
- ✅ Sử dụng `useNavigate()` hook cho programmatic navigation

---

## 📊 Route Mapping

| Trang | Route Cũ | Route Mới | Component |
|-------|----------|-----------|-----------|
| Quản lý địa chỉ (Profile) | `/addresses` | `/account/addresses` | `SavedAddressesPage` |
| Chọn địa chỉ (Checkout) | `/checkout` (step 1) | `/checkout` (step 1) | `CheckoutStep1` (với Modal) |

---

## 🎯 Kết Quả

### Trước Khi Sửa:
- ❌ Cả 2 trang dùng chung `/addresses`
- ❌ "Add New Address" trong Checkout → navigate → reload
- ❌ Người dùng bị văng ra khỏi luồng thanh toán

### Sau Khi Sửa:
- ✅ Profile: `/account/addresses` (quản lý địa chỉ)
- ✅ Checkout: `/checkout` với Modal (chọn địa chỉ)
- ✅ "Add New Address" trong Checkout → Modal → không navigate
- ✅ Người dùng không bị văng ra khỏi luồng thanh toán
- ✅ Navigation mượt mà với `<Link>` và `useNavigate()`

---

## 📝 Files Đã Sửa

1. ✅ `src/routes/AppRoutes.tsx`
   - Đổi route `/addresses` → `/account/addresses`

2. ✅ `src/components/checkout/CheckoutStep1.tsx`
   - Thay `<Link>` bằng `<button>` cho "Add New Address"
   - Thêm state `isModalOpen` và `form`
   - Tạo Modal component với form đầy đủ
   - Thêm `handleSubmitAddress` để xử lý submit
   - Address mới tự động được chọn sau khi tạo

3. ✅ `src/constants/accountNavigation.ts`
   - Cập nhật path từ `/addresses` → `/account/addresses`

4. ✅ `src/data/index.ts`
   - Cập nhật path từ `/addresses` → `/account/addresses`

---

## ✅ Checklist

- [x] Tạo route mới `/account/addresses` cho SavedAddressesPage
- [x] Tạo Modal component cho "Add New Address" trong Checkout
- [x] Thay `<Link>` bằng `<button>` trong CheckoutStep1
- [x] Cập nhật tất cả links từ `/addresses` sang `/account/addresses`
- [x] Đảm bảo không dùng `window.location.href`
- [x] Modal tự động chọn address mới sau khi tạo
- [x] Không có linter errors

---

## 🎨 Modal Features

### UI/UX:
- **Z-Index**: `z-[60]` - nằm đè lên tất cả nội dung
- **Backdrop**: `bg-slate-950/40 backdrop-blur-md` - blur effect
- **Shadow**: `shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]` - shadow lớn
- **Border Radius**: `rounded-3xl` - bo góc lớn
- **Responsive**: `max-w-[640px]` - responsive trên mobile

### Form Fields:
- Address Type: Home, Office, Other (buttons)
- Full Name (required)
- Phone Number (required)
- Street Address (required)
- Apartment (optional)
- City, State, Zip Code (required)
- Country (dropdown, required)
- Set as default (checkbox)

### Behavior:
- Click outside → đóng modal
- Click X button → đóng modal
- Submit → thêm address, tự động chọn, đóng modal
- Validation: Required fields

---

**Tổng kết:** Đã tách thành công routes và tạo Modal cho "Add New Address" trong Checkout. Người dùng giờ đây không bị văng ra khỏi luồng thanh toán và navigation hoạt động mượt mà! 🎉

