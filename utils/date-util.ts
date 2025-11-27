import dayjs from "dayjs";

const getTimeText = (date: dayjs.Dayjs) => {
  return date.format("HH:mm");
};

const getDayText = (date: dayjs.Dayjs) => {
  const dayTexts = ["日", "月", "火", "水", "木", "金", "土"];
  return dayTexts[date.day()];
};

/**
 * 日時の範囲をテキストで返す
 * @param start 開始日時
 * @param end 終了日時
 * @returns 日時の範囲をテキストで返す
 */
export const getTimeSpanText = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (startDate.month() === endDate.month()) {
    if (startDate.date() === endDate.date()) {
      return `${startDate.format("YYYY/MM/DD")}(${getDayText(startDate)}) ${getTimeText(startDate)} 〜 ${getTimeText(endDate)}`;
    }
    return `${startDate.format("YYYY/MM/DD")}(${getDayText(startDate)}) ${getTimeText(startDate)} 〜 ${endDate.date()}(${getDayText(endDate)}) ${getTimeText(endDate)}`;
  }
  return `${startDate.format("YYYY/MM/DD")}(${getDayText(startDate)}) ${getTimeText(startDate)} 〜 ${endDate.format("MM/DD")}(${getDayText(endDate)}) ${getTimeText(endDate)}`;
};

//年度を計算する
export const getFiscalYear = (date: Date): number =>
  date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
