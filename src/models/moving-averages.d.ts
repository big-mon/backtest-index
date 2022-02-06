declare module "moving-averages" {
  export declare function ma(data: number[], size: number): number[];
  export declare function dma(
    data: number[],
    alpha: Number | Array<Number>,
    noHead: Boolean
  ): number[];
  export declare function ema(data: number[], size: number): number[];
  export declare function sma(
    data: number[],
    size: number,
    times: number = 1
  ): number[];
  export declare function wma(data: number[], size: number): number[];
}
