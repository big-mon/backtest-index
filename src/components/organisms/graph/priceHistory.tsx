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
import { dataFormatter } from "models/formatter";
import { Price } from "models/prices";

/** ETFの価格推移グラフ
 * @param data グラフ用価格データ配列
 */
export const PriceHistoryGraph = (data: Price[]) => {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3" />
        <XAxis dataKey="Date" minTickGap={30} />
        <YAxis />
        <Tooltip formatter={dataFormatter} />
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
