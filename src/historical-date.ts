
import { Calendar } from './calendar';
import { JulianDate } from "./julian-date";
import { GregorianDate } from "./gregorian-date";

export abstract class HistoricalDate<T = Calendar> {
    constructor(public readonly calendar: T) { }

    abstract year: number;
    abstract month: number;
    abstract day: number;
    abstract readonly isLeapYear: boolean;
    abstract toGregorian(): GregorianDate;
    abstract toJulian(): JulianDate
}
