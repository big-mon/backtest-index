/** 資産推移 */
export type Asset = {
  /** 日付 */
  Date: Date;
  /** 総資産 */
  Total: number;
  /** 保有現金価値 */
  Cash: number;
  /** 保有株式価値 */
  Equity: number;
  /** 比較対象(継続保有) */
  BuyAndHold: number;
};
