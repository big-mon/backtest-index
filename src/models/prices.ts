/** 価格推移 */
export type Price = {
  /** 日付 */
  Date: Date;
  /** 価格 */
  Value: number;
  /** 移動平均 */
  MA?: number;
};
