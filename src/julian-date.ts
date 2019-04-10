import { isLeapYear, parseDateString } from "./common";
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

    constructor(public readonly year: number,
        public readonly month: number,
        public readonly day: number) {
        super('julian');
        this.assertLegalDate(year, month, day);
    }

    /**
     * Creates a new JulianDate object based on the number of Julian days.
     * @param jd 
     */
    static fromJulianDays(jd: number) {
        jd += 0.5;
        let z = Math.trunc(jd);

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

        return new JulianDate(year, month, day);
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
    private assertLegalDate(year: number, month: number, day: number) {
        if (day < 0 || day > this.monthLength(year, month)) {
            throw new InvalidDateException(`Month ${month} doesn't have a day ${day}`);
        }

        return true;
    }

    /**
     * Convert to Julian day using astronomical years (0 = 1 BC, -1 = 2 BC)
     */
    private toJulianDays(year: number = this.year,
        month: number = this.month,
        day: number = this.day) {
        // Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61
        if (month <= 2) {
            year -= 1;
            month += 12;
        }

        return (Math.trunc((365.25 * (year + 4716))) + Math.trunc((30.6001 * (month + 1))) + day) - 1524.5
    }

    private monthLength(year: number, month: number) {
        return month == 2
            ? isLeapYear(year, 'julian') ? 29 : 28
            : HAVE_30_DAYS.indexOf(month) >= 0 ? 30 : 31;
    }

    public addDays(days: number) {
        if (days == 0) { return this; }
        return JulianDate.fromJulianDays(this.toJulianDays() + days);
    }

    public toGregorian() {
        let julianDays = this.toJulianDays();
        return GregorianDate.fromJulianDays(julianDays);
    }

    public toJulian() {
        return this;
    }

    public toString() {
        return `${this.year}-${this.month}-${this.day} (Julian)`;
    }
}
