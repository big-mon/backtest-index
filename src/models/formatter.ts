/** 数値単位のフォーマット
 * @param number フォーマット対象となる元数値
 */
export const dataFormatter = (number: number) => {
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
