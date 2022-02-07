import { useState, useRef, useEffect } from "react";
import { ma, ema, wma } from "moving-averages";
import { Price } from "models/prices";
import { Asset } from "models/assets";
import { MaTypes, AllMaType } from "models/maTypes";
import { MaWindowTypes, MaRangeType, AllMaWindowType } from "models/maWindow";
import { TradeTimings, TradeTiming, AllTradeTiming } from "models/tradeTiming";
import { PriceHistoryGraph } from "components/organisms/graph/priceHistory";
import { AssetGraph } from "components/organisms/graph/asset";
import styles from "styles/Home.module.scss";
import dailyJson from "data/daily.json";

const Home = () => {
  const windowElm = useRef<HTMLInputElement | null>(null);
  const [maWindow, setWindow] = useState<number>(200);

  const maTypeElm = useRef<HTMLSelectElement | null>(null);
  const [maType, setMaType] = useState<string>(MaTypes.Simple);

  const tradeTimingElm = useRef<HTMLSelectElement | null>(null);
  const [tradeTiming, setTrade] = useState<string>(TradeTimings.MonthEnd);

  const priceHistory = calculateMovingAverage(
    maType,
    MaWindowTypes.Date,
    maWindow,
    jsonToPriceHistory()
  );

  const [tradeOptions, setTradeOptions] = useState<Date[]>(
    retrieveTradeTimingOption(priceHistory, tradeTiming)
  );

  const handleClick = () => {
    // 移動平均線種類
    if (maTypeElm.current) setMaType(maTypeElm.current.value);

    // 期間設定
    if (windowElm.current) setWindow(windowElm.current.valueAsNumber);

    // 売買判断
    if (tradeTimingElm.current) setTrade(tradeTimingElm.current.value);

    setTradeOptions(retrieveTradeTimingOption(priceHistory, tradeTiming));
  };

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

      <div className={styles.bigGraph}>{PriceHistoryGraph(priceHistory)}</div>

      <div className={styles.bigGraph}>
        {AssetGraph(
          calcAsset(
            priceHistory,
            tradeOptions,
            priceHistory[0].Date,
            priceHistory[priceHistory.length - 1].Date
          )
        )}
      </div>
    </main>
  );
};

/** 元データのJSONを取得
 * @returns JSONから整形したデータ
 */
const jsonToPriceHistory = (): Price[] =>
  dailyJson.map((x) => ({ Date: new Date(x.Date), Value: x["Adj Close"] }));

/** 移動平均を追記
 * @param type 移動平均線の種類
 * @param rangeType 日足、週足、月足
 * @param window 期間設定
 * @param baseData 元データ
 * @returns baseDataに対して移動平均を追記したデータ
 */
const calculateMovingAverage = (
  type: string,
  rangeType: MaRangeType,
  window: number,
  baseData: Price[]
): Price[] => {
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

/** 売買判断を行う日付を取得
 * @param data 算出対象期間内データ
 * @param timing 売買判断のタイミング
 * @returns 日付リスト
 */
const retrieveTradeTimingOption = (data: Price[], timing: string) => {
  let optionList: Price["Date"][] = [];

  // yyyy-mm文字列の取得関数
  const calcDateString = (date: Date) =>
    date.getFullYear() + "-" + (date.getMonth() + 1);

  // 月リストを取得
  const monthList = new Set(data.map((d) => calcDateString(d.Date)));

  // 月をループ
  monthList.forEach((month) => {
    // 対象月のデータに絞り込み
    const targetMonthDates = data.filter(
      (d) => calcDateString(d.Date) === month
    );

    // 売買判断タイミングに合わせて日付を抽出
    switch (timing) {
      case TradeTimings.MonthStart:
        // 月初
        optionList.push(targetMonthDates[0].Date);
        break;
      default:
        // 月末
        optionList.push(targetMonthDates[targetMonthDates.length - 1].Date);
        break;
    }
  });

  return optionList;
};

/** 資産の推移を計算
 * @param history 対象商品の価格推移
 * @param trade 売買判断日
 * @param start 計算開始日
 * @param end 計算終了日
 * @param initialCash 初期資金
 * @returns 資産の推移
 */
const calcAsset = (
  history: Price[],
  trade: Date[],
  start: Date,
  end: Date,
  initialCash: number = 100000
): Asset[] => {
  let result: Asset[] = [];
  let nowCash: number = initialCash;
  let nowEquityQuantity: number = 0;
  let averageCost: number = 0;
  const compareQuantity = Math.floor(nowCash / history[0].Value);

  // 売買判断
  const isBuy = (price: Price): boolean =>
    price.MA ? price.Value > price.MA : false;
  const isSell = (price: Price): boolean =>
    price.MA ? price.Value < price.MA : false;

  history.forEach((his) => {
    let todayAsset: Asset = {
      Date: his.Date,
      Total: nowCash + nowEquityQuantity * his.Value,
      Cash: nowCash,
      Equity: nowEquityQuantity * his.Value,
      BuyAndHold: compareQuantity * his.Value,
    };

    if (
      !his.MA ||
      !trade.some((d) => d.getTime() === his.Date.getTime()) ||
      (!isBuy(his) && !isSell(his))
    ) {
      // 売買を行わない日の場合
      result.push(todayAsset);
      return;
    }

    if (isBuy(his)) {
      // 購入及びホールド時
      const buyQuantity = Math.floor(nowCash / his.Value);
      const buyCost = his.Value * buyQuantity;
      const beforeAvgCost = Number(averageCost.toString());
      const beforeQuantity = nowEquityQuantity;
      const afterAvgCost =
        (beforeAvgCost * nowEquityQuantity + buyCost) /
        (beforeQuantity + buyQuantity);

      nowCash -= buyCost;
      nowEquityQuantity += buyQuantity;
      averageCost = afterAvgCost;

      todayAsset.Cash = nowCash;
      todayAsset.Equity = nowEquityQuantity * his.Value;
      todayAsset.Total = todayAsset.Cash + todayAsset.Equity;
    } else if (isSell(his)) {
      // 売却及びホールド時
      const sellTotal = his.Value * nowEquityQuantity;
      nowCash += sellTotal;
      nowEquityQuantity = 0;
      averageCost = 0;

      todayAsset.Equity = 0;
      todayAsset.Cash = nowCash;
      todayAsset.Total = todayAsset.Cash + todayAsset.Equity;
    } else {
      // 移動平均と同値時
    }

    result.push(todayAsset);
  });

  return result;
};

export default Home;
