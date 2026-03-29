/** Thẻ KPI trên Dashboard — dữ liệu từ API hiện có, không dùng mock. */
export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  /** Mô tả ngắn dưới giá trị (nguồn dữ liệu / gợi ý). */
  subtitle: string;
  icon: string;
  iconWrapClass: string;
};
