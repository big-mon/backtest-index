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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip formatter={dataFormatter} />
        <Legend />
        <Line
          dataKey="Value"
          name="ETF Value"
          type="linear"
          stroke="#003f5c"
          dot={false}
        />
        <Line
          dataKey="MA"
          name="MA"
          type="linear"
          stroke="#58508d"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
