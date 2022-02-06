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

export const PriceHistoryGraph = (data: Price[]) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={500}
        height={200}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip formatter={dataFormatter} />
        <Legend />
        <Line
          dataKey="Value"
          name="ETF Value"
          type="linear"
          stroke="#8884d8"
          dot={false}
        />
        <Line
          dataKey="MA"
          name="MA"
          type="linear"
          stroke="#82ca9d"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
