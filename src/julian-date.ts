import { isLeapYear, parseDateString, JulianDays } from "./common";
import { HistoricalDate } from './historical-date';
import { InvalidDateException } from './invalid-date-exception';
import { GregorianDate } from "./gregorian-date";

// Licensed under the MIT license:
// http://opensource.org/licenses/MIT
// Copyright (c) 2016, fitnr <fitnr@fakeisthenewreal>
// based on https://github.com/fitnr/convertdate/blob/5a1d1323c34670c5e179900d8770db59c009e679/convertdate/julian.py

const HAVE_30_DAYS = [4, 6, 9, 11];

export class JulianDate extends HistoricalDate {
    public get isLeapYear() {
        return isLeapYear(this.year, this.calendar);
    }

    constructor(public readonly year: number | undefined,
        public readonly month: number | undefined,
        public readonly day: number | undefined) {
        super('julian');
        this.assertLegalDate(year, month, day);
    }

    /**
     * Creates a new JulianDate object based on the number of Julian days.
     */
    static fromJulianDays(jd: JulianDays) {
        let days = jd.days;
        days += 0.5;
        let z = Math.trunc(days);

        let a = z;
        let b = a + 1524;
        let c = Math.trunc((b - 122.1) / 365.25);
        let d = Math.trunc(365.25 * c);
        let e = Math.trunc((b - d) / 30.6001);

        let month: number;
        if (e < 14) {
            month = e - 1;
        } else {
            month = e - 13;
        }
        let year: number;
        if (month > 2) {
            year = c - 4716;
        } else {
            year = c - 4715;
        }
        let day = b - d - Math.trunc(30.6001 * e);

        return new JulianDate(
            jd.unknownYear ? undefined : year,
            jd.unknownMonth ? undefined : month,
            jd.unknownDay ? undefined : day);
    }

    static fromString(text: string) {
        const parsed = parseDateString(text);
        if (parsed) {
            return new JulianDate(parsed.year, parsed.month, parsed.day);
        }
        throw new InvalidDateException();
    }

    /**
     * Check if this is a legal date in the Julian calendar
     */
    private assertLegalDate(year: number | undefined, month: number | undefined, day: number | undefined) {
        if (day !== undefined && (day < 0 || day > this.monthLength(year, month))) {
            throw new InvalidDateException(`Month ${month} doesn't have a day ${day}`);
        }

        return true;
    }

    /**
     * Convert to Julian day using astronomical years (0 = 1 BC, -1 = 2 BC)
     */
    private toJulianDays(year: number = this.year || 1,
        month: number = this.month || 1,
        day: number = this.day || 1) {
        // Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61
        if (month <= 2) {
            year -= 1;
            month += 12;
        }

        return {
            days: (Math.trunc((365.25 * (year + 4716))) + Math.trunc((30.6001 * (month + 1))) + day) - 1524.5,
            unknownYear: this.year === undefined,
            unknownMonth: this.month === undefined,
            unknownDay: this.day === undefined
        }
    }

    private monthLength(year: number | undefined, month: number | undefined) {
        return month == 2
            ? isLeapYear(year, 'julian') ? 29 : 28
            : HAVE_30_DAYS.indexOf(month || 1) >= 0 ? 30 : 31;
    }

    public addDays(days: number) {
        if (days == 0) { return this; }
        const jd = this.toJulianDays();
        jd.days += days;
        return JulianDate.fromJulianDays(jd);
    }

    public toGregorian() {
        const julianDays = this.toJulianDays();
        return GregorianDate.fromJulianDays(julianDays);
    }

    public toJulian() {
        return this;
    }

    public toString() {
        return `${this.year === undefined ? '??' : this.year}-${this.month === undefined ? '??' : this.month}-${this.day === undefined ? '??' : this.day} (Julian)`;
    }
}
