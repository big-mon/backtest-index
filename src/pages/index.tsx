import styles from "styles/Home.module.css";
import { useState, useRef } from "react";
import priceJson from "data/price.json";
import { Price } from "models/prices";
import { ma, ema, wma } from "moving-averages";
import { MaTypes, MaType, AllMaType } from "models/maTypes";
import { MaWindowTypes, MaRangeType, AllMaWindowType } from "models/maWindow";
import { PriceHistoryGraph } from "components/organisms/graph/priceHistory";

const Home = () => {
  const windowInputElm = useRef<HTMLInputElement | null>(null);
  const [maWindow, changeWindow] = useState<number>(200);

  const maTypeSelectElm = useRef<HTMLSelectElement | null>(null);
  const [maType, changeMaType] = useState<string>(MaTypes.Simple);

  const handleClick = () => {
    // 移動平均線種類
    if (
      maTypeSelectElm.current &&
      typeof (maTypeSelectElm.current.value as MaType)
    ) {
      changeMaType(maTypeSelectElm.current.value);
    }

    // 期間設定
    if (windowInputElm.current) {
      changeWindow(windowInputElm.current.valueAsNumber);
    }
  };

  const data = calculateMovingAverage(
    maType,
    MaWindowTypes.Date,
    maWindow,
    jsonToPriceHistory()
  );

  return (
    <main>
      <fieldset>
        <legend>テスト条件</legend>

        <div>
          <p>
            <label>
              <span className={styles.settingTitle}>移動平均線種類</span>
              <select ref={maTypeSelectElm} defaultValue={AllMaType[0]}>
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
              <span className={styles.settingTitle}>期間設定</span>
              <input
                type="number"
                defaultValue={maWindow}
                ref={windowInputElm}
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
              <span className={styles.settingTitle}>売買判断</span>
              <select defaultValue={"月末"}>
                <option disabled>月初</option>
                <option value="月末">月末</option>
              </select>
            </label>
          </p>
        </div>

        <button onClick={handleClick}>Run</button>
      </fieldset>

      {PriceHistoryGraph(data)}
    </main>
  );
};

/** 元データのJSONを取得 */
const jsonToPriceHistory = () => {
  let list: Price[] = priceJson.map((x) => {
    return { Date: x.Date, Value: x["Adj Close"] };
  });

  return list;
};

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
