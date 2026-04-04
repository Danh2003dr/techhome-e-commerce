import { apiGet, apiPost } from '@/services/api';
import type { ConversationListItemDto, MessageDto, SupportMetaDto } from '@/types/api';

export function getSupportMeta(): Promise<SupportMetaDto> {
  return apiGet<SupportMetaDto>('/messages/meta/support');
}

export function getConversations(): Promise<ConversationListItemDto[]> {
  return apiGet<ConversationListItemDto[]>('/messages');
}

export function getMessageThread(peerUserId: string | number): Promise<MessageDto[]> {
  return apiGet<MessageDto[]>(`/messages/${encodeURIComponent(String(peerUserId))}`);
}

export function sendTextMessage(
  toUserId: number,
  text: string,
  opts?: { productId?: number }
): Promise<MessageDto> {
  const body: Record<string, unknown> = { to: toUserId, text };
  if (opts?.productId != null) {
    body.productId = opts.productId;
  }
  return apiPost<MessageDto>('/messages', body);
}
