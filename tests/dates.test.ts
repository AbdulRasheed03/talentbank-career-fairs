import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDaysISO,
  formatDateRange,
  formatFullDate,
  monthLabel,
  toStamp,
  todayInKL,
} from "../src/lib/dates";

// ---------------------------------------------------------------------------
// M2 tests — date formatting + arithmetic. These are the trickiest helpers
// because of the "never parse YYYY-MM-DD with new Date()" rule, so they get
// the most edge cases: month/year rollover, leap-safe day maths, range shapes.
// ---------------------------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

test("formatDateRange: single day", () => {
  assert.equal(formatDateRange("2026-02-07", "2026-02-07"), "7 Feb 2026");
});

test("formatDateRange: same month", () => {
  assert.equal(formatDateRange("2026-02-07", "2026-02-08"), "7–8 Feb 2026");
});

test("formatDateRange: cross-month, same year", () => {
  assert.equal(formatDateRange("2026-01-31", "2026-02-01"), "31 Jan – 1 Feb 2026");
});

test("formatDateRange: cross-year", () => {
  assert.equal(
    formatDateRange("2026-12-31", "2027-01-01"),
    "31 Dec 2026 – 1 Jan 2027",
  );
});

test("addDaysISO: rolls over month boundary", () => {
  assert.equal(addDaysISO("2026-01-31", 1), "2026-02-01");
});

test("addDaysISO: rolls over year boundary", () => {
  assert.equal(addDaysISO("2026-12-31", 1), "2027-01-01");
});

test("addDaysISO: goes backwards across a month (2026 is not a leap year)", () => {
  assert.equal(addDaysISO("2026-03-01", -1), "2026-02-28");
});

test("monthLabel: YYYY-MM to human label", () => {
  assert.equal(monthLabel("2026-02"), "February 2026");
  assert.equal(monthLabel("2026-11"), "November 2026");
});

test("formatFullDate: weekday is computed correctly", () => {
  // 1 August 2026 is a Saturday.
  assert.equal(formatFullDate("2026-08-01"), "Saturday, 1 August 2026");
  assert.equal(formatFullDate("2026-02-07"), "Saturday, 7 February 2026");
});

test("toStamp: strips dashes for the calendar link", () => {
  assert.equal(toStamp("2026-02-07"), "20260207");
});

test("todayInKL: returns a well-formed YYYY-MM-DD", () => {
  assert.match(todayInKL(), ISO_DATE);
});
