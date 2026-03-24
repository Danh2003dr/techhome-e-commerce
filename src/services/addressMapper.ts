import type { AddressDto } from '@/types/api';
import type { SavedAddress } from '@/types';

function normLabel(l: string | null | undefined): 'Home' | 'Office' | 'Other' {
  if (l === 'Home' || l === 'Office' || l === 'Other') return l;
  return 'Other';
}

export function addressDtoToSaved(d: AddressDto): SavedAddress {
  const label = normLabel(d.label);
  const tagPrimary = label === 'Home';
  const tagIcon = label === 'Home' ? 'home' : label === 'Office' ? 'work' : 'add_location';
  const apt = d.apartment?.trim() ?? '';
  const cityPart = [d.city, d.state].filter((x) => x && String(x).trim()).join(', ');
  const cityStateZip = [cityPart, d.zipCode?.trim()].filter((x) => x).join(' ').trim();
  const addressLines = [d.street, apt, cityStateZip, d.country].filter((x) => x && String(x).trim()) as string[];

  return {
    id: String(d.id),
    label,
    tagIcon,
    tagPrimary,
    name: d.name,
    phone: d.phone,
    addressLines,
    street: d.street,
    apartment: apt,
    city: d.city,
    state: d.state ?? '',
    zipCode: d.zipCode ?? '',
    country: d.country ?? '',
    isDefault: Boolean(d.isDefault),
  };
}
