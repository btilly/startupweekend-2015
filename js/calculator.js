/**  Global value.  Amount to save each month.  Main return of the calculator.*/
var monthlyRetireAmount = 0;
/**  Combination of savings, contributions, and withdrawls.  */
var netWorthEachYear = [];

/**
 * 
 * @param {Object}   data   Format:
 *                              annualDesiredIncome:
 *                                  annualIncome,
 *                                  incomeFromAge,
 *                                  incomeToAge,
 *                              savingsInfo:
 *                                  currentSavings,
 *                                  savingInterestRate,
 *                                  fromAge,
 *                                  toAge
 *                              assumptions:
 *                                  interestRate,
 *                                  inflationRate,
 *                                  expectedFromSS, //added 
 *     sample:  
 *              {
 *               "annualDesiredIncome":{
 *                                      "annualIncome":"3.5",
 *                                      "incomeFromAge":"65",
 *                                      "incomeToAge":"95"
 *                                      },
 *               "savingsInfo":{
 *                              "currentSavings":"100",
 *                              "savingInterestRate":"0.6",
 *                              "fromAge":"40",
 *                              "toAge":"65"
 *                              },
 *               "assumptions":{
 *                              "interestRate":"0.5",
 *                              "inflationRate":"5.2",
 *                              "expectedFromSS":"20000.0"
 *                              }
 *               }
 *
 * @returns {Function}            A function that returns the monthly savings.
 */
function doCal(data) {
    netWorthEachYear = [];
    var desiredIncome = Number(data.annualDesiredIncome.annualIncome);
    var incomeFromAge = Number(data.annualDesiredIncome.incomeFromAge);
    var incomeToAge = Number(data.annualDesiredIncome.incomeToAge);
    var numYearsWithIncome = incomeToAge - incomeFromAge;
    
    var currSavings = Number(data.savingsInfo.currentSavings);
    var savingsInterestRate = Number(data.savingsInfo.savingInterestRate);
    var savingsFromAge = Number(data.savingsInfo.fromAge);
    var savingsToAge = Number(data.savingsInfo.toAge);
    var numYearsWithSavings = savingsToAge - savingsFromAge;
    
    var retirementInterestRate = Number(data.assumptions.interestRate);
    var inflationRate = Number(data.assumptions.inflationRate);
    var expectedSS = Number(data.assumptions.expectedFromSS);
    
    var retiredAmount = calcNeededMoneysAtRetire(desiredIncome - expectedSS,
            retirementInterestRate - inflationRate, numYearsWithIncome);
    var annualRetireAmount = calcYearlyComps(retiredAmount - currSavings,
            savingsInterestRate - inflationRate, numYearsWithSavings);
    monthlyRetireAmount = annualRetireAmount / 12;  // It was annual.
    
    var i;
    var r = (savingsInterestRate - inflationRate) * 1e-2;

    var dollars = currSavings;
    for(i = 0; i < numYearsWithSavings; i++) {
        dollars = (dollars + annualRetireAmount) * (1 + r);
        netWorthEachYear[i] = dollars;
    }

    r = (retirementInterestRate - inflationRate) * 1e-2;
    var newDollars = 0;
    for(i = numYearsWithSavings; 
        i < (numYearsWithSavings + numYearsWithIncome); i++) {
        newDollars = (dollars + expectedSS - desiredIncome) * (1 + r);
        dollars = newDollars;
        netWorthEachYear[i] = dollars;
    }
    
    return hardFunct;
}
/**
 * Calculate the annual saving amount based on the total amount needed at the
 * start of retirement.
 *
 * @param {Number} howMuchWanted  Total amount needed at the start of retirement
 * @param {Number} interestRate   Savings interest rate in percent.
 * @param {Number} workingYears   Number of years before retirement.
 * @returns {Number}              Amount needed to be saved each month.
 */
function calcYearlyComps(howMuchWanted, interestRate, workingYears) {
    var r = interestRate / 100.0;
    var foo = 1 - Math.pow((1 + r), -workingYears);
    if (foo < 1e-4) {
        if (workingYears >= 1) {
            return howMuchWanted / workingYears;
        } else {
            return howMuchWanted;
        }
    } else {
        var answer = 0;
        foo = (1 + r);
        for (var i = 1; i <= workingYears; i++) {
            answer += Math.pow(foo, i);
        }
        return howMuchWanted / answer;
    }
}
/**
 * 
 * @param {Number} desiredIncome
 * @param {Number} interestRate
 * @param {Number} retireYears
 * @returns {Number}
 */
function calcNeededMoneysAtRetire(desiredIncome, interestRate, retireYears) {
    var r = interestRate / 100.0;
    var i;
    var moneysAtRetire;
    for (i = 1, moneysAtRetire = 0; i <= retireYears; i++) {
        var foo = Math.pow((1 - r), i);
        moneysAtRetire += desiredIncome * foo;
    }
    // Now, do present value calc to get the retireMoneys back to current time.
    return moneysAtRetire;
}

/**
 * Returned from doCal() function.  Used by user interface.
 * If no parameters, return the amount to save each month.
 * If parameters are supplied, return an array with net worth at each year.
 *
 * @param {type} args    Not important, just exist or not exist.
 * @returns              Monthly investment amount or annual net worth.
 */
var hardFunct = function(args) {
    if (args === undefined) {
        return monthlyRetireAmount;
    } else {
        return netWorthEachYear;
    }
};
