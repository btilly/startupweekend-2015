var normalSamplePoints = [
   -1.9600,
   -1.4395,
   -1.1503,
   -0.9346,
   -0.7554,
   -0.5978,
   -0.4538,
   -0.3186,
   -0.1891,
   -0.0627,
    0.0627,
    0.1891,
    0.3186,
    0.4538,
    0.5978,
    0.7554,
    0.9346,
    1.1503,
    1.4395,
    1.9600
];

var historicalInvestmentRate = 0.0812928519071564;
var historicalLogNormalSD = 0.271923959338221;

/**
 *
 **/
function calcDistribution (options) {
    var initial = Number(options.initialInvestment);
    var interestRate = Number(options.interestRate);
    var savingAmount = Number(options.savingAmount);
    var retirementAmount = Number(options.retirementIncome);
    var incomeFromAge = Number(options.incomeFromAge);
    var incomeToAge = Number(options.incomeToAge);
    var retirementToAge = Number(options.retirementToAge);

    var currentWorth = [];
    // NOTE: This 100 is tied to the thresholds in saveToAnswer
    for (var i = 0; i < 100; i++) {
        currentWorth[i] = initial;
    }

    var answer = [];
    var currentYear = new Date().getFullYear();
    var findAvgWorth = function (i) {
        return currentWorth[i];
    };
    var labels = ["percent-10", "percent-30", "percent-50", "percent-70", "percent-90"];
    var saveToAnswer = function (period) {
        var thisRecord = {
            year: (currentYear + period).toString(),
            age: (period + incomeFromAge).toString(),
            "percent-10-raw": findAvgWorth(9),
            "percent-30-raw": findAvgWorth(29),
            "percent-50-raw": findAvgWorth(49),
            "percent-70-raw": findAvgWorth(69),
            "percent-90-raw": findAvgWorth(89)
        };
        for (var i = 0; i < labels.length; i++) {
            var value = thisRecord[labels[i] + "-raw"];
            thisRecord[labels[i]] = (0 < value) ? value.toFixed(2) : 0;
        }
        answer.push(thisRecord);
    };

    var standardDeviation =
        historicalLogNormalSD * interestRate / historicalInvestmentRate;

    // Calculate what happens over saving period.
    for (var i = incomeFromAge; i < incomeToAge; i++) {
        saveToAnswer(i - incomeFromAge);
        var nextWorth = [];
        for (var j = 0; j < currentWorth.length; j++) {
            for (var k = 0; k < normalSamplePoints.length; k++) {
                nextWorth.push(
                    currentWorth[j] *
                        (1 + interestRate) *
                        Math.exp(normalSamplePoints[k] * standardDeviation) +
                    savingAmount
                );
            }
        }

        // nextWorth has more data than I want.  Sort and average to get the
        // next distribution.
        nextWorth.sort(function (a, b) {return a - b});
        for (var j = 0; j < currentWorth.length; j++) {
            var size = normalSamplePoints.length;
            var upperBound = (j+1) * size;
            var sum = 0;
            for (var k = size * j; k < upperBound; k++) {
                sum += nextWorth[k];
            }
            currentWorth[j] = sum / size;
            var limit = 1e9;
            if (currentWorth[j] < - limit) {
                currentWorth[j] = - limit;
            }
            else if (limit < currentWorth[j]) {
                currentWorth[j] = limit;
            }
        }
    }

    // Calculate what happens over retirement period.
    for (var i = incomeToAge; i < retirementToAge + 1; i++) {
        saveToAnswer(i - incomeFromAge);
        var nextWorth = [];
        for (var j = 0; j < currentWorth.length; j++) {
            for (var k = 0; k < normalSamplePoints.length; k++) {
                nextWorth.push(
                    currentWorth[j] *
                        (1 + interestRate) *
                        Math.exp(normalSamplePoints[k] * standardDeviation) -
                    retirementAmount
                );
            }
        }

        // nextWorth has more data than I want.  Sort and average to get the
        // next distribution.
        nextWorth.sort(function (a, b) {return a - b});
        for (var j = 0; j < currentWorth.length; j++) {
            var size = normalSamplePoints.length;
            var upperBound = (j+1) * size;
            var sum = 0;
            for (var k = size * j; k < upperBound; k++) {
                sum += nextWorth[k];
            }
            currentWorth[j] = sum / size;
            // overflow errors.
            var limit = 1e9;
            if (currentWorth[j] < - limit) {
                currentWorth[j] = - limit;
            }
            else if (limit < currentWorth[j]) {
                currentWorth[j] = limit;
            }
        }
    }

    return answer;
}

function calcSavingAmount (inputOptions) {
    var options = inputOptions;
    var lowerBound = 0;
    var upperBound = 100;
    options["savingAmount"] = upperBound * 12;
    var data = calcDistribution(options);
    while (data[ data.length - 1 ]["percent-50-raw"] < 0) {
        lowerBound = upperBound;
        upperBound = 2 * upperBound;
        options.savingAmount = upperBound * 12;
        data = calcDistribution(options);
    }

    while (lowerBound + 0.015 < upperBound) {
        var midBound = Number(((lowerBound + upperBound)/2).toFixed(2));
        options.savingAmount = midBound * 12;
        data = calcDistribution(options);
        var finalValue = data[ data.length - 1 ]["percent-50-raw"];
        if (finalValue < 0) {
            lowerBound = midBound;
        }
        else {
            upperBound = midBound;
        }
    }
    return lowerBound;
}

function ageRunOutBottom10Pct (data) {
    var lastAge;
    for (var i = 1; i < data.length; i++) {
        if (0 < data[i]["percent-10"]) {
            lastAge = data[i].age;
        }
        else {
            return lastAge;
        }
    }
}

function finalWealthTop10Pct (data) {
    return data[data.length - 1]["percent-90"].toString().replace(/\B(?=(\d{3})+\b)/g, ",");
}
