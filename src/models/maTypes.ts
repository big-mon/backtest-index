/** 移動平均線の種類 */
export const MaTypes = {
  Simple: "(SMA) 単純移動平均線",
  Weighted: "(WMA) 加重移動平均線",
  Exponential: "(EMA) 指数平滑移動平均線",
} as const;

/** 移動平均線の種類 */
export type MaType = typeof MaTypes[keyof typeof MaTypes];

/** 移動平均線の種類のループ出力用定義 */
export const AllMaType = Object.values(MaTypes);
