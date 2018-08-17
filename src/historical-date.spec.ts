import { createDate } from "./common";
import { HistoricalDate } from "./historical-date";

describe('Historical dates', () => {
    it('Offset days', () => {
        expectOffsetDays(createDate(1600, 1, 1, 'julian'));
        expectOffsetDays(createDate(1600, 1, 1, 'gregorian'));
    });

    it('Same dates', () => {
        let date = createDate(1600, 1, 1);
        for (let i = 0; i < 1000; i++) {
            expect(date.toGregorian().equals(date)).toBeTruthy();
            expect(date.toGregorian().equals(date.toGregorian())).toBeTruthy();
            expect(date.toGregorian().equals(date.toJulian())).toBeTruthy();
            expect(date.toJulian().equals(date)).toBeTruthy();
            expect(date.toJulian().equals(date.toJulian())).toBeTruthy();
            expect(date.toJulian().equals(date.toGregorian())).toBeTruthy();

            date = date.addDays(1);
        }
    });

    function expectOffsetDays(historicalDate: HistoricalDate) {
        let nativeDate = historicalDate.toDate();

        for (let i = 0; i < 500; i++) {
            let offset = Math.floor(Math.random() * 500) - 250;

            let nextHistorical = historicalDate.addDays(offset);

            let nextNative = new Date(nativeDate.valueOf());
            nextNative.setDate(nextNative.getDate() + offset);

            expect(nextHistorical.toDate()).toEqual(nextNative);

            historicalDate = nextHistorical;
            nativeDate = nextNative;
        };
    }
})