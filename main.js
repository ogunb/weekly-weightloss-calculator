const cvsToJson = require('csvtojson/v2');

const WEEK_DAYS = 7;
const DATA_PATH = './data';
const FILE_NAME = process.argv.slice(2);
cvsToJson({ checkType: true })
    .fromFile(`${DATA_PATH}/${FILE_NAME}.csv`)
    .then(calculate)

function calculate(data) {
    const cleanData = data.filter(({ fatRate }) => !!fatRate).sort((a, b) => a.timestamp - b.timestamp);
    const lastTwoWeeks = cleanData.slice(cleanData.length - (WEEK_DAYS * 2)).map(a => {
        a.timestamp = new Date(a.timestamp * 1000);
        return a;
    });
    const [firstWeek, secondWeek] = [lastTwoWeeks.slice(0, WEEK_DAYS), lastTwoWeeks.slice(WEEK_DAYS)]

    const getAverageWeight = (arr) => arr.reduce((total, { weight }) => total + weight, 0) / WEEK_DAYS;
    const lastWeekWeight = getAverageWeight(firstWeek);
    const currentWeight = getAverageWeight(secondWeek);
    const lostWeight = (lastWeekWeight - currentWeight).toFixed(3) + 'kg';
    console.log(lastTwoWeeks)
    console.log({
        lastWeekWeight,
        currentWeight,
        lostWeight,
    })
}
