/**
 * Derived from http://www.nabkal.de/ostrech1.html
 */
export type Calendar = 'julian' | 'gregorian';
const Littera = ["f", "e", "d", "c", "b", "A", "g"];
const EpaktFeld = ["XXIII", "XXII", "XXI", "XX", "XIX", "XVIII", "XVII", "XVI", "XV", "XIV", "XIII", "XII", "XI", "X", "IX", "VIII", "VII", "VI", "V", "IV", "III", "II", "I", " * ", "XXIX", "XXVIII", "XXVII", "XXVI", "XXV", "XXIV", "25"];

export function calculate(year: number, style: Calendar) {
    let easterDay = getEasterDay(year, style);
    let jd = easterDay.jd;

    return {
        ostersonntag: makeDate(jd, style),
        septuagesima: makeDate(jd - 63, style),
        aschermittwoch: makeDate(jd - 46, style),
        himmelfahrt: makeDate(jd + 39, style),
        pfingstsonntag: makeDate(jd + 49, style),
        trinitatis: makeDate(jd + 56, style),
        fronleichnam: makeDate(jd + 60, style),
        advent: makeDateAdv(year, style),
        epakte: easterDay.epakte,
        goldeneZahl: easterDay.goldeneZahl,
        konkurrente: easterDay.konkurrente,
        sonntagsbuchst: easterDay.sonntagsbuchst,
        gaussZahlD: easterDay.gaussZahlD,
        gaussZahlM: easterDay.gaussZahlM
    }
}

function makeDate(jd: number, s: Calendar) {
    let tz = jd - 1721119;
    if (s == 'gregorian') {
        tz += floor(tz / 36524.25) - floor(tz / 146097) - 2
    }
    tz += 2;
    let y = floor((tz - 0.2) / 365.25);
    let r = tz - floor(y * 365.25);
    let m = floor((r - 0.5) / 30.6);
    let d = r - floor(m * 30.6 + 0.5);
    m += 3;
    if (m > 12) { m -= 12; y++ }
    return {
        day: d,
        month: m,
        year: y
    };
}

function makeDateAdv(y: number, s: Calendar) {
    let a = getDay(25, 12, y, s);
    let jd = a - mod(a, 7) - 22;
    let x = makeDate(jd, s);
    return x;
}
function getEasterDay(year: number, style: Calendar) {
    let easter = gauss(year, style);
    return {
        jd: getDay(22, 3, year, style) + easter.marchOffset,
        epakte: easter.epakte,
        goldeneZahl: easter.goldeneZahl,
        konkurrente: easter.konkurrente,
        sonntagsbuchst: easter.sonntagsbuchst,
        gaussZahlD: easter.gaussZahlD,
        gaussZahlM: easter.gaussZahlM
    };
}

function gauss(y: number, style: Calendar) {
    /**
     * Calculate the Easter date using Gauss's Easter algorithm
     */
    let m: number, q: number;
    let h1 = floor(y / 100);
    let h2 = floor(y / 400);
    if (style == 'julian') {
        m = 15;
        q = 6;
    } else {
        m = 15 + h1 - h2 - floor((8 * h1 + 13) / 25);
        q = 4 + h1 - h2;
    }
    let a = mod(y, 19);
    let b = mod(y, 4);
    let c = mod(y, 7);
    let d = mod((19 * a + m), 30);
    let e = mod((2 * b + 4 * c + 6 * d + q), 7);
    let g = d + e;
    if (g == 35) {
        g = 28;
    }
    if ((d == 28) && (e == 6) && (a > 10)) {
        g = 27;
    }

    // Easter + 22 days
    let marchOffset = g;
    let goldeneZahl = a + 1;
    let gaussZahlD = d;
    let gaussZahlM = mod(m, 30);
    let konkurrente = mod(2 - (2 * b + 4 * c + q), 7) + 1;
    let sonntagsbuchst = Littera[konkurrente - 1];
    let epa = gaussZahlD;
    if ((epa == 28) && (a > 10)) {
        epa = 30;
    }
    if (style == 'julian') {
        epa = mod((epa + 8), 30);
    }
    let epakte = EpaktFeld[epa];
    return {
        /**
         * Offset from 22th of March
         */
        marchOffset,
        epakte,
        goldeneZahl,
        konkurrente,
        sonntagsbuchst,
        gaussZahlD,
        gaussZahlM
    };
}

function floor(x: number) {
    return Math.floor(x)
}

function mod(n: number, d: number) {
    let q = n % d;
    return q < 0 ? d + q : q;
}

function getDay(d: number, m: number, y: number, s: Calendar) {
    m -= 3;
    if (m < 0) { m += 12; y--; }
    let x = floor(y * 365.25) + floor(m * 30.6 + 0.5) + d + 1721117;
    if (s == 'gregorian') {
        x -= floor(y / 100) - floor(y / 400) - 2;
    }
    return x
}
