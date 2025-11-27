const getTimeText = (date: Date) => {
  date = new Date(date);
  return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }`;
};
const getDayText = (date: Date) => {
  date = new Date(date);
  const dayTexts = ["日", "月", "火", "水", "木", "金", "土"];
  return `${dayTexts[date.getDay()]}`;
};
export const getTimeSpanText = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate.getMonth() + 1 === endDate.getMonth() + 1) {
    if (startDate.getDate() === endDate.getDate()) {
      return `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}(${getDayText(
        startDate,
      )}) ${getTimeText(startDate)}~${getTimeText(endDate)}`;
    }
    return `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}(${getDayText(
      startDate,
    )}) ${getTimeText(startDate)} ~ ${endDate.getDate()}(${getDayText(endDate)}) ${getTimeText(endDate)}`;
  }
  return `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}(${getDayText(
    startDate,
  )}) ${getTimeText(startDate)} ~ ${endDate.getMonth() + 1}/${endDate.getDate()}(${getDayText(
    endDate,
  )}) ${getTimeText(endDate)}`;
};

//年度を計算する
export const getFiscalYear = (date: Date): number =>
  date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
