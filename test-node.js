console.log('Testing compatibility with running from node...')
var { parseDateString } = require('./dist/historical-dates.js')
if (parseDateString('February 27th, 1987')) {
    console.log('Import in node works!')
}
