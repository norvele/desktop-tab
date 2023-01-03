import differenceInHours from "date-fns/differenceInHours";
import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInSeconds from "date-fns/differenceInSeconds";
import startOfYear from "date-fns/startOfYear";
import getWeek from "date-fns/getWeek";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";

export function getSeedByDate(
  date: Date,
  interval: number,
  unit: "second" | "minute" | "hour" | "day" | "week" | "month"
): string {
  switch (unit) {
    case "second":
      return getSeedBySecond(date, interval);
    case "minute":
      return getSeedByMinute(date, interval);
    case "hour":
      return getSeedByHour(date, interval);
    case "day":
      return getSeedByDay(date, interval);
    case "week":
      return getSeedByWeek(date, interval);
    case "month":
      return getSeedByMonth(date, interval);
    default:
      throw new Error(`Unit ${unit} is not supported`);
  }
}

function getSeedBySecond(date: Date, interval: number) {
  const seconds = differenceInSeconds(date, startOfYear(date));
  const id = Math.floor(seconds / interval);
  return getSeed(date, interval, `second${id}`);
}

function getSeedByMinute(date: Date, interval: number) {
  const minutes = differenceInMinutes(date, startOfYear(date));
  const id = Math.floor(minutes / interval);
  return getSeed(date, interval, `minute${id}`);
}

function getSeedByHour(date: Date, interval: number) {
  const hours = differenceInHours(date, startOfYear(date));
  const id = Math.floor(hours / interval);
  return getSeed(date, interval, `hour${id}`);
}

function getSeedByDay(date: Date, interval: number) {
  const days = Math.floor(differenceInHours(date, startOfYear(date)) / 24);
  const id = Math.floor(days / interval);
  return getSeed(date, interval, `day${id}`);
}

function getSeedByWeek(date: Date, interval: number) {
  const week = getWeek(date, {
    weekStartsOn: 1, // TODO: make it configurable
  });
  const id = Math.floor(week / interval);
  return getSeed(date, interval, `week${id}`);
}

function getSeedByMonth(date: Date, interval: number) {
  const month = getMonth(date);
  const id = Math.floor(month / interval);
  return getSeed(date, interval, `month${id}`);
}

function getSeed(date: Date, interval: number, id: string | number) {
  const p = {
    year: getYear(date),
    interval,
    id,
  };
  return Object.entries(p)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
}
