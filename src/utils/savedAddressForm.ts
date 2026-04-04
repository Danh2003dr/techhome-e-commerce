import type { SavedAddressDto } from '@/types/api';

/** Các ô form địa chỉ giao hàng (hồ sơ + checkout). */
export interface SavedAddressFormFields {
  label: string;
  recipientName: string;
  recipientPhone: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  note: string;
}

export function emptySavedAddressForm(): SavedAddressFormFields {
  return {
    label: '',
    recipientName: '',
    recipientPhone: '',
    street: '',
    ward: '',
    district: '',
    province: '',
    note: '',
  };
}

/** Ghép thành một khối văn bản gửi lên đơn hàng / defaultAddress. */
export function composeSavedAddressLine(f: SavedAddressFormFields): string {
  const name = f.recipientName.trim();
  const phone = f.recipientPhone.trim();
  const street = f.street.trim();
  const ward = f.ward.trim();
  const district = f.district.trim();
  const province = f.province.trim();
  const note = f.note.trim();

  const lines: string[] = [];
  const who = [name, phone].filter(Boolean).join(' · ');
  if (who) lines.push(who);
  const loc = [street, ward, district, province].filter(Boolean).join(', ');
  if (loc) lines.push(loc);
  if (note) lines.push(`Ghi chú: ${note}`);
  return lines.join('\n').trim();
}

export function validateSavedAddressForm(f: SavedAddressFormFields): string | null {
  if (!f.recipientName.trim()) return 'Vui lòng nhập họ và tên người nhận.';
  if (!f.recipientPhone.trim()) return 'Vui lòng nhập số điện thoại người nhận.';
  const phoneDigits = f.recipientPhone.replace(/\D/g, '');
  if (phoneDigits.length < 9) return 'Số điện thoại không hợp lệ (ít nhất 9 chữ số).';
  if (!f.street.trim()) return 'Vui lòng nhập số nhà, tên đường.';
  if (!f.district.trim()) return 'Vui lòng nhập quận / huyện.';
  if (!f.province.trim()) return 'Vui lòng nhập tỉnh / thành phố.';
  const line = composeSavedAddressLine(f);
  if (line.length < 12) return 'Địa chỉ chưa đủ chi tiết.';
  return null;
}

export function savedAddressDtoToForm(a: SavedAddressDto): SavedAddressFormFields {
  return {
    label: (a.label ?? '').trim(),
    recipientName: (a.recipientName ?? '').trim(),
    recipientPhone: (a.recipientPhone ?? '').trim(),
    street: (a.street ?? '').trim(),
    ward: (a.ward ?? '').trim(),
    district: (a.district ?? '').trim(),
    province: (a.province ?? '').trim(),
    note: (a.note ?? '').trim(),
  };
}

export function buildSavedAddressDto(id: string, f: SavedAddressFormFields, line: string): SavedAddressDto {
  return {
    id,
    label: f.label.trim(),
    recipientName: f.recipientName.trim(),
    recipientPhone: f.recipientPhone.trim(),
    street: f.street.trim(),
    ward: f.ward.trim(),
    district: f.district.trim(),
    province: f.province.trim(),
    note: f.note.trim(),
    line: line.trim(),
  };
}
