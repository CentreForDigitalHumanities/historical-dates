import { isLeapYear, InvalidDateException } from "./common";
import { GregorianDate } from "./gregorian";

// Licensed under the MIT license:
// http://opensource.org/licenses/MIT
// Copyright (c) 2016, fitnr <fitnr@fakeisthenewreal>
// based on fitnr/julian.py

const HAVE_30_DAYS = [4, 6, 9, 11];

export class JulianDate {
    public readonly calendar = 'julian';
    public get isLeapYear() {
        return isLeapYear(this.year, this.calendar);
    }

    constructor(public readonly year: number,
        public readonly month: number,
        public readonly day: number) {
        this.assertLegalDate(year, month, day);
    }

    /**
     * Check if this is a legal date in the Julian calendar
     */
    private assertLegalDate(year: number, month: number, day: number) {
        if (day < 0 || day > this.monthLength(year, month)) {
            throw new InvalidDateException(`Month ${month} doesn't have a day ${day}`);
        }

        return true;
    }

    /**
     * Convert to Julian day using astronomical years (0 = 1 BC, -1 = 2 BC)
     */
    private toJulianDay(year: number, month: number, day: number) {
        // Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61

        if (month <= 2) {
            year -= 1;
            month += 12;
        }

        return (Math.trunc((365.25 * (year + 4716))) + Math.trunc((30.6001 * (month + 1))) + day) - 1524.5
    }

    public monthLength(year: number, month: number) {
        return month == 2
            ? isLeapYear(year, 'julian') ? 29 : 28
            : HAVE_30_DAYS.indexOf(month) >= 0 ? 30 : 31;
    }

    public toGregorian() {
        return GregorianDate.fromJulianDays(this.toJulianDay(this.year, this.month, this.day));
    }
}
