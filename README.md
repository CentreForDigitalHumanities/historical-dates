[![Build Status](https://travis-ci.org/UUDigitalHumanitieslab/historical-dates.svg?branch=master)](https://travis-ci.org/UUDigitalHumanitieslab/historical-dates)

# Historical Dates

JavaScript/TypeScript library for converting/calculating Roman and Easter dates. Based on [Axel Findling's Roman date converter](http://cgi.axel-findling.de/cgi-bin/romdat) and [Nikolaus A. Bär's easter date calculator](http://www.nabkal.de/ostrech1.html).

<div class="center">
<blockquote class="twitter-tweet" data-lang="nl"><p lang="en" dir="ltr">Friend: Do dates make you nervous?<br>Me: omg yes especially when doing math across timezone boundaries</p>&mdash; Yak Painter (@dcousineau) <a href="https://twitter.com/dcousineau/status/760848423268519936?ref_src=twsrc%5Etfw">3 augustus 2016</a></blockquote>
</div>

## Determining Easter dates

```typescript
import { calcEaster } from 'historical-dates';

let easter = calcEaster(1400, 'julian');
console.log(easter.sunday);
// 1400-4-18 (Julian)
```

## Parsing Roman dates

```typescript
import { RomanDate } from 'historical-dates';

let romanDate = RomanDate.fromString('prid kal. mar mdc', 'gregorian');
console.log(romanDate);
// pr. Kal. Mart. MDC
console.log(romanDate.toDate());
// 1600-2-28
```

## Converting Julian and Gregorian dates

```typescript
import { createDate } from 'historical-dates';

let julianDate = createDate(1582, 10, 5, 'julian');
let gregorianDate = julianDate.toGregorian();
console.log(gregorianDate);
// 1582-10-15
```
