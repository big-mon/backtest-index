/** 売買判断の種類 */
export const TradeTimings = {
  Daily: "毎日",
  MonthStart: "月初",
  MonthEnd: "月末",
} as const;

/** 売買判断の種類 */
export type TradeTiming = typeof TradeTimings[keyof typeof TradeTimings];

/** 売買判断の種類のループ出力用定義 */
export const AllTradeTiming = Object.values(TradeTimings);
