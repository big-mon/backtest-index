import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Asset } from "models/assets";

/** 資産推移グラフ
 * @param data グラフ用価格データ配列
 */
export const AssetGraph = (data: Asset[]) => {
  return (
    <ResponsiveContainer>
      <ComposedChart data={data} syncId="history">
        <CartesianGrid strokeDasharray="3" />
        <XAxis dataKey="Date" minTickGap={30} tickFormatter={dateFormatter} />
        <YAxis />
        <Tooltip formatter={numFormatter} labelFormatter={dateFormatter} />
        <Legend />
        <Area dataKey="Equity" stackId="1" fill="#003f5c" stroke="#003249" />
        <Area dataKey="Cash" stackId="1" fill="#bc5090" stroke="#964073" />
        <Line dataKey="BuyAndHold" stroke="#bc5090" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

/** 数値のフォーマット
 * @param number フォーマット対象
 * @returns フォーマット後文字列
 */
const numFormatter = (number: number): string => {
  const abs = number < 0 ? -number : number;
  const fixNum = (num: number) =>
    Math.floor(num * Math.pow(10, 2)) / Math.pow(10, 2);

  if (abs > 1000000000) {
    return fixNum(number / 1000000000).toString() + "Bil";
  } else if (abs > 1000000) {
    return fixNum(number / 1000000).toString() + "Mil";
  } else if (abs > 1000) {
    return fixNum(number / 1000).toString() + "K";
  } else {
    return fixNum(number).toString();
  }
};

/** 日付のフォーマット
 * @param date フォーマット対象
 * @returns フォーマット後文字列
 */
const dateFormatter = (date: Date): string =>
  date.getUTCFullYear() +
  "-" +
  (date.getUTCMonth() + 1) +
  "-" +
  date.getUTCDate();
