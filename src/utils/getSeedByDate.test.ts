import { describe, expect, test } from "vitest";
import { getSeedByDate } from "@/utils/getSeedByDate";

interface TestCase {
  title?: string;
  interval: number;
  unit: "hour" | "day" | "week" | "month";
  datesWithTheSameResult: string[];
  datesWithDifferentResult: string[];
}

const cases: TestCase[] = [
  {
    interval: 1,
    unit: "hour",
    datesWithTheSameResult: [
      "2023-01-01T00:00:00.000",
      "2023-01-01T00:30:00.000",
      "2023-01-01T00:59:59.000",
    ],
    datesWithDifferentResult: [
      "2023-01-03T12:30:30.000",
      "2023-01-01T01:00:00.000",
      "2022-12-31T23:59:59.000",
    ],
  },
  {
    interval: 12,
    unit: "hour",
    datesWithTheSameResult: [
      "2023-01-01T00:00:00.000",
      "2023-01-01T06:10:00.000",
      "2023-01-01T11:59:59.000",
    ],
    datesWithDifferentResult: [
      "2023-01-03T12:30:30.000",
      "2023-01-01T12:00:00.000",
      "2022-12-31T23:59:59.000",
    ],
  },
  {
    interval: 1,
    unit: "day",
    datesWithTheSameResult: [
      "2023-01-01T00:00:00.000",
      "2023-01-01T06:30:00.000",
      "2023-01-01T23:59:59.000",
    ],
    datesWithDifferentResult: [
      "2023-01-03T12:30:30.000",
      "2023-01-02T00:00:00.000",
      "2022-12-31T23:59:59.000",
    ],
  },
  {
    interval: 15,
    unit: "day",
    datesWithTheSameResult: [
      "2023-01-01T00:00:00.000",
      "2023-01-06T06:30:00.000",
      "2023-01-15T23:59:59.000",
    ],
    datesWithDifferentResult: [
      "2023-02-03T12:30:30.000",
      "2023-01-16T00:00:00.000",
      "2022-12-31T23:59:59.000",
    ],
  },
  {
    interval: 1,
    unit: "week",
    datesWithTheSameResult: [
      "2023-01-02T00:00:00.000", // Monday
      "2023-01-04T06:30:00.000", // Wednesday
      "2023-01-08T23:59:59.000", // Sunday
    ],
    datesWithDifferentResult: [
      "2023-02-03T12:30:30.000", // Another month
      "2023-01-09T00:00:00.000", // Monday
      "2022-12-31T23:59:59.000", // Another year
    ],
  },
  {
    interval: 1,
    unit: "month",
    datesWithTheSameResult: [
      "2023-01-02T00:00:00.000",
      "2023-01-15T06:30:00.000",
      "2023-01-31T23:59:59.000",
    ],
    datesWithDifferentResult: [
      "2023-02-03T12:30:30.000",
      "2023-02-01T00:00:00.000",
      "2022-12-31T23:59:59.000",
    ],
  },
];

describe("getSeedByDate", () => {
  cases.forEach((testCase) => {
    const title = testCase.title || `${testCase.interval} ${testCase.unit}`;
    test(title, () => {
      let firstSeed: any;
      const firstDateISO = testCase.datesWithTheSameResult[0];
      testCase.datesWithTheSameResult.forEach((dateISO) => {
        const date = new Date(dateISO);
        const seed = getSeedByDate(date, testCase.interval, testCase.unit);
        if (firstSeed) {
          expect(
            seed,
            `Seed "${seed}" from "${dateISO}" is not equal "${firstSeed}" from the first date "${firstDateISO}"`
          ).toBe(firstSeed);
        } else {
          firstSeed = seed;
        }
      });
      testCase.datesWithDifferentResult.forEach((dateISO) => {
        const date = new Date(dateISO);
        const seed = getSeedByDate(date, testCase.interval, testCase.unit);
        expect(
          seed === firstSeed,
          `Seed "${seed}" from "${dateISO}" should be not equal "${firstSeed}"`
        ).toBe(false);
      });
    });
  });
});
