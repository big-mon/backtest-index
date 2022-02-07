import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Price } from "models/prices";

/** ETFの価格推移グラフ
 * @param data グラフ用価格データ配列
 */
export const PriceHistoryGraph = (data: Price[]) => {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3" />
        <XAxis dataKey="Date" minTickGap={30} tickFormatter={dateFormatter} />
        <YAxis />
        <Tooltip formatter={numFormatter} labelFormatter={dateFormatter} />
        <Legend />
        <Line dataKey="Value" name="ETF Value" stroke="#003f5c" dot={false} />
        <Line
          dataKey="MA"
          name="MA"
          stroke="#58508d"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

/** 数値のフォーマット
 * @param number フォーマット対象
 * @returns フォーマット後文字列
 */
const numFormatter = (number: number): string => {
  const abs = number < 0 ? -number : number;
  const num = Math.floor(number * Math.pow(10, 2)) / Math.pow(10, 2);

  if (abs > 1000000000) {
    return (num / 1000000000).toString() + "Bil";
  } else if (abs > 1000000) {
    return (num / 1000000).toString() + "Mil";
  } else if (abs > 1000) {
    return (num / 1000).toString() + "K";
  } else {
    return num.toString();
  }
};

/** 日付のフォーマット
 * @param date フォーマット対象
 * @returns フォーマット後文字列
 */
const dateFormatter = (date: Date): string =>
  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDay();
