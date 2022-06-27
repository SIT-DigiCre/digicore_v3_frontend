export const getTimeText = (date: Date) => {
  date = new Date(date);
  return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }`;
};
export const getDayText = (date: Date) => {
  date = new Date(date);
  const dayTexts = ["日", "月", "火", "水", "木", "金", "土"];
  return `${dayTexts[date.getDay()]}`;
};
export const getTimeSpanText = (start: Date, end: Date) => {
  start = new Date(start);
  end = new Date(end);
  if (start.getMonth() + 1 === end.getMonth() + 1) {
    if (start.getDate() === end.getDate()) {
      return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}(${getDayText(
        start,
      )}) ${getTimeText(start)}~${getTimeText(end)}`;
    }
    return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}(${getDayText(
      start,
    )}) ${getTimeText(start)} ~ ${end.getDate()}(${getDayText(end)}) ${getTimeText(end)}`;
  }
  return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}(${getDayText(
    start,
  )}) ${getTimeText(start)} ~ ${end.getMonth() + 1}/${end.getDate()}(${getDayText(
    end,
  )}) ${getTimeText(end)}`;
};
