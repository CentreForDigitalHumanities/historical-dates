import { isLeapYear, InvalidDateException } from "./common";

// Licensed under the MIT license:
// http://opensource.org/licenses/MIT
// Copyright (c) 2016, fitnr <fitnr@fakeisthenewreal>
// based on fitnr/gregorian.py

const EPOCH = 1721425.5;

const INTERCALATION_CYCLE_YEARS = 400;
const INTERCALATION_CYCLE_DAYS = 146097;

const LEAP_SUPPRESSION_YEARS = 100;
const LEAP_SUPPRESSION_DAYS = 36524;

const LEAP_CYCLE_YEARS = 4;
const LEAP_CYCLE_DAYS = 1461;

const YEAR_DAYS = 365;

const HAVE_30_DAYS = [4, 6, 9, 11];

export class GregorianDate {
    public readonly calendar = 'gregorian';
    public get isLeapYear() {
        return isLeapYear(this.year, this.calendar);
    }

    constructor(public readonly year: number,
        public readonly month: number,
        public readonly day: number) {
        assertLegalDate(year, month, day);
    }

    static fromJulianDays(jd: number) {
        let wjd = Math.floor(jd - 0.5) + 0.5;
        let depoch = wjd - EPOCH

        let quadricent = Math.floor(depoch / INTERCALATION_CYCLE_DAYS)
        let dqc = depoch % INTERCALATION_CYCLE_DAYS

        let cent = Math.floor(dqc / LEAP_SUPPRESSION_DAYS)
        let dcent = dqc % LEAP_SUPPRESSION_DAYS

        let quad = Math.floor(dcent / LEAP_CYCLE_DAYS)
        let dquad = dcent % LEAP_CYCLE_DAYS

        let yindex = Math.floor(dquad / YEAR_DAYS)
        let year = (
            quadricent * INTERCALATION_CYCLE_YEARS +
            cent * LEAP_SUPPRESSION_YEARS +
            quad * LEAP_CYCLE_YEARS + yindex
        )

        if (cent != 4 && yindex != 4) {
            year += 1
        }
        let yearDay = wjd - toJulianDays(year, 1, 1)

        let leap = isLeapYear(year);
        let leapAdj: number;
        if (yearDay < 58 && leap) {
            leapAdj = 0
        } else if (leap) {
            leapAdj = 1
        } else {
            leapAdj = 2
        }

        let month = Math.floor((((yearDay + leapAdj) * 12) + 373) / 367);
        let day = Math.trunc(wjd - toJulianDays(year, month, 1)) + 1;

        return new GregorianDate(year, month, day);
    }

}

/**
 * Gregorian to Julian Day Count for years between 1801-2099
 * @see http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
 */
function toJulianDays1801(year: number, month: number, day: number) {
    if (month <= 2) {
        year = year - 1;
        month = month + 12;
    }

    let a = Math.floor(year / 100);
    let b = Math.floor(a / 4);
    let c = 2 - a + b;
    let e = Math.floor(365.25 * (year + 4716));
    let f = Math.floor(30.6001 * (month + 1));

    return c + day + e + f - 1524.5
}

function toJulianDays(year: number, month: number, day: number) {
    assertLegalDate(year, month, day);

    if (year >= 1801 || year <= 2099) {
        return toJulianDays1801(year, month, day);
    }

    let leapAdj;

    if (month <= 2) {
        leapAdj = 0
    } else if (isLeapYear(year)) {
        leapAdj = -1
    } else {
        leapAdj = -2
    }

    return (
        EPOCH - 1 + (YEAR_DAYS * (year - 1)) +
        Math.floor((year - 1) / LEAP_CYCLE_YEARS) +
        (-Math.floor((year - 1) / LEAP_SUPPRESSION_YEARS)) +
        Math.floor((year - 1) / INTERCALATION_CYCLE_YEARS) +
        Math.floor((((367 * month) - 362) / 12) + leapAdj + day));
}

/**
 * Check if this is a legal date in the Gregorian calendar
 */
function assertLegalDate(year: number, month: number, day: number) {
    let daysInMonth;
    if (month == 2) {
        daysInMonth = isLeapYear(year) ? 29 : 28;
    } else {
        daysInMonth = HAVE_30_DAYS.indexOf(month) >= 0 ? 30 : 31;
    }

    if (day < 0 || day > daysInMonth) {
        throw new InvalidDateException(`Month ${month} doesn't have a day ${day}`);
    }

    return true;
}
