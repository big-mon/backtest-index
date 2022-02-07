import { useState, useRef } from "react";
import { ma, ema, wma } from "moving-averages";
import { Price } from "models/prices";
import { MaTypes, AllMaType } from "models/maTypes";
import { MaWindowTypes, MaRangeType, AllMaWindowType } from "models/maWindow";
import { TradeTimings, TradeTiming, AllTradeTiming } from "models/tradeTiming";
import { PriceHistoryGraph } from "components/organisms/graph/priceHistory";
import styles from "styles/Home.module.scss";
import dailyJson from "data/daily.json";

const Home = () => {
  const windowElm = useRef<HTMLInputElement | null>(null);
  const [maWindow, changeWindow] = useState<number>(200);

  const maTypeElm = useRef<HTMLSelectElement | null>(null);
  const [maType, changeMaType] = useState<string>(MaTypes.Simple);

  const tradeTimingElm = useRef<HTMLSelectElement | null>(null);
  const [tradeTiming, changeTrade] = useState<string>(TradeTimings.MonthEnd);

  const handleClick = () => {
    // 移動平均線種類
    if (maTypeElm.current) changeMaType(maTypeElm.current.value);

    // 期間設定
    if (windowElm.current) changeWindow(windowElm.current.valueAsNumber);

    // 売買判断
    if (tradeTimingElm.current) changeTrade(tradeTimingElm.current.value);
  };

  const data = calculateMovingAverage(
    maType,
    MaWindowTypes.Date,
    maWindow,
    jsonToPriceHistory()
  );

  return (
    <main>
      <fieldset className={styles.fieldset}>
        <legend>テスト条件</legend>

        <div>
          <p>
            <label>
              <span>移動平均線種類</span>
              <select ref={maTypeElm} defaultValue={AllMaType[0]}>
                {AllMaType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </p>

          <p>
            <label>
              <span>期間設定</span>
              <input
                type="number"
                defaultValue={maWindow}
                ref={windowElm}
                min={1}
                max={999}
              />
              <select defaultValue={AllMaWindowType[0]}>
                {AllMaWindowType.map((type) => {
                  return (
                    <option key={type} value={type} disabled>
                      {type}
                    </option>
                  );
                })}
              </select>
            </label>
          </p>

          <p>
            <label>
              <span>売買判断</span>
              <select ref={tradeTimingElm} defaultValue={AllTradeTiming[1]}>
                {AllTradeTiming.map((type) => {
                  return (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  );
                })}
              </select>
            </label>
          </p>
        </div>

        <button onClick={handleClick}>Run</button>
      </fieldset>

      <div className={styles.bigGraph}>{PriceHistoryGraph(data)}</div>
    </main>
  );
};

/** 元データのJSONを取得 */
const jsonToPriceHistory = (): Price[] =>
  dailyJson.map((x) => ({ Date: new Date(x.Date), Value: x["Adj Close"] }));

/** 移動平均を追記 */
const calculateMovingAverage = (
  type: string,
  rangeType: MaRangeType,
  window: number,
  baseData: Price[]
) => {
  // 各日の価格配列から移動平均を算出
  const valuesList = baseData.map((data) => data.Value);
  let maList: number[];
  switch (type) {
    case MaTypes.Weighted:
      // 加重移動平均
      maList = wma(valuesList, window);
      break;
    case MaTypes.Exponential:
      // 指数平滑移動平均
      maList = ema(valuesList, window);
      break;
    default:
      // 単純移動平均
      maList = ma(valuesList, window);
      break;
  }

  // 各日に移動平均を追記
  const result = baseData.map((original, i) => ({
    ...original,
    MA: maList[i],
  }));
  return result;
};

export default Home;
