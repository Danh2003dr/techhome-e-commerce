/**
 * AI product generator — gọi qua backend (Spring Boot → Gemini).
 * API key được giữ bí mật ở server, không expose ra frontend.
 */
import { apiPost } from './api';

export interface GeneratedProduct {
  name: string;
  description: string;
  suggestedPrice: number;
  categoryHint: string;
  model?: string;
}

export async function generateProductInfo(keyword: string): Promise<GeneratedProduct> {
  const data = await apiPost<GeneratedProduct & { message?: string }>(
    '/admin/ai/generate',
    { keyword },
    { auth: true }
  );

  if (!data.name) {
    throw new Error((data as { message?: string }).message ?? 'AI không tạo được thông tin sản phẩm');
  }

  return {
    name: data.name,
    description: data.description,
    suggestedPrice: Number(data.suggestedPrice) || 0,
    categoryHint: data.categoryHint ?? '',
    model: data.model,
  };
}

/** Luôn true — không cần key ở frontend nữa */
export function isAiConfigured(): boolean {
  return true;
}
