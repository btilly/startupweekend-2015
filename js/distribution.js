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

console.log(logNormalSamplePoints);

/**
 *
 **/
function calcDistribution (options) {
    var initial = Number(options.initialInvestment);
    var interestRate = Number(options.interestRate);
    var savingAmount = Number(options.savingRate);
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
        var value = (currentWorth[i] + currentWorth[i+1])/2;
        return (0 < value) ? value : 0;
    };
    var saveToAnswer = function (period) {
        answer.push({
            year: (currentYear + period).toString(),
            "percent-10": findAvgWorth(1),
            "percent-30": findAvgWorth(5),
            "percent-50": findAvgWorth(9),
            "percent-70": findAvgWorth(13),
            "percent-90": findAvgWorth(17)
        });
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
    for (var i = incomeToAge; i < incomeToAge + 1; i++) {
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

