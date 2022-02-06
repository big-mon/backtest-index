/** 移動平均線の計算基準 */
export const MaWindowTypes = {
  Date: "日",
  Week: "週",
  Month: "月",
} as const;

/** 移動平均線の計算基準 */
export type MaRangeType = typeof MaWindowTypes[keyof typeof MaWindowTypes];

/** 移動平均線の計算基準のループ出力用定義 */
export const AllMaWindowType = Object.values(MaWindowTypes);
