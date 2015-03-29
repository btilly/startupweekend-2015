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
    // NOTE: This 20 is tied to the thresholds in saveToAnswer
    for (var i = 0; i < 20; i++) {
        currentWorth[i] = initial;
    }

    var answer = [];
    var currentYear = new Date().getFullYear();
    var findAvgWorth = function (i) {
        return (currentWorth[i] + currentWorth[i+1])/2;
    };
    var labels = ["percent-10", "percent-30", "percent-50", "percent-70", "percent-90"];
    var saveToAnswer = function (period) {
        var thisRecord = {
            year: (currentYear + period).toString(),
            "percent-10-raw": findAvgWorth(1),
            "percent-30-raw": findAvgWorth(5),
            "percent-50-raw": findAvgWorth(9),
            "percent-70-raw": findAvgWorth(13),
            "percent-90-raw": findAvgWorth(17)
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
        }
    }

    return answer;
}

function calcSavingAmount (inputOptions) {
    var options = inputOptions;
    var lowerBound = 0;
    var upperBound = 100;
    options["savingAmount"] = upperBound * 12;
    //console.log(options);
    var data = calcDistribution(options);
    while (data[ data.length - 1 ]["percent-50-raw"] < 0) {
        //console.log({lower: lowerBound, upper:upperBound, value: data[ data.length - 1 ]["percent-50-raw"]})
        lowerBound = upperBound;
        upperBound = 2 * upperBound;
        options.savingAmount = upperBound * 12;
        data = calcDistribution(options);
    }

    while (lowerBound + 0.015 < upperBound) {
        //console.log({lower: lowerBound, upper:upperBound, value: data[ data.length - 1 ]["percent-50-raw"]})
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
