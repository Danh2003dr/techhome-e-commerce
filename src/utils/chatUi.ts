import type { MessageDto, MessageUserRefDto } from '@/types/api';
import { getSocketBaseUrl } from '@/services/socketUrl';

export function chatDisplayName(u: MessageUserRefDto): string {
  const n = u.name?.trim();
  if (n) return n;
  const e = u.email?.trim();
  if (e) return e;
  return 'Khách hàng';
}

export function chatOtherInMessage(msg: MessageDto, myId: number): MessageUserRefDto {
  return Number(msg.from.id) === myId ? msg.to : msg.from;
}

export function chatFilePublicUrl(relativePath: string): string {
  if (!relativePath) return '#';
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  const origin = getSocketBaseUrl();
  return `${origin.replace(/\/+$/, '')}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}
