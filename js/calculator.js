/**  Global value.  Amount to save each month.  Main return of the calculator.*/
var retireAmount = 0;
/**
 * Number of years from now until retirement.
 * Assume constantly put into retirement savings.
 */
var numYearsWithIncome;
/**  Number of years from retirement.  */
var numYearsWithSavings;
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
    var desiredIncome = data.annualDesiredIncome.annualIncome;
    var incomeFromAge = data.annualDesiredIncome.incomeFromAge;
    var incomeToAge = data.annualDesiredIncome.incomeToAge;
    numYearsWithIncome = incomeToAge - incomeFromAge;
    
    var currSavings = data.savingsInfo.currentSavings;
    var savingsInterestRate = data.savingsInfo.savingInterestRate;
    var savingsFromAge = data.savingsInfo.fromAge;
    var savingsToAge = data.savingsInfo.toAge;
    numYearsWithSavings = savingsToAge - savingsFromAge;
    
    var retirementInterestRate = data.assumptions.interestRate;
    var inflationRate = data.assumptions.inflationRate;
    var expectedSS = data.assumptions.expectedFromSS;
    
    //var testMoney = calcPresentRetireMoneys(100, 5.0, 1, 0);
    //console.log(testMoney);
    //testMoney = calcPresentRetireMoneys(100, 5.0, 2, 0);
    //console.log(testMoney);
    //testMoney = calcPresentRetireMoneys(100, 5.0, 3, 0);
    //console.log(testMoney);

    var retiredAmount = calcPresentRetireMoneys(desiredIncome - expectedSS,
            retirementInterestRate - inflationRate, numYearsWithIncome, 0);
    retireAmount = calcMonthlyComps(retiredAmount - currSavings,
            savingsInterestRate - inflationRate, numYearsWithSavings);
    retireAmount /= 12;  // It was annual.
    
    var i;
    var dollars = currSavings;
    for(i = 0; i < numYearsWithIncome; i++) {
        dollars += retireAmount;
        netWorthEachYear[i] = dollars;
    }
    for(i = numYearsWithIncome; 
        i < (numYearsWithIncome + numYearsWithSavings); i++) {
        dollars += expectedSS - desiredIncome;
        netWorthEachYear[i] = dollars;
    }
    
    return hardFunct;
}
/**
 * Calculate the monthly saving amount based on the total amount needed at the
 * start of retirement.
 *
 * @param {Number} howMuchWanted  Total amount needed at the start of retirement
 * @param {Number} interestRate   Savings interest rate in percent.
 * @param {Number} workingYears   Number of years before retirement.
 * @returns {Number}              Amount needed to be saved each month.
 */
function calcMonthlyComps(howMuchWanted, interestRate, workingYears) {
    var r = interestRate / 100.0;
    var foo = 1 - Math.pow((1 + r), -workingYears);
    var answer = r * howMuchWanted / foo;
    return answer;
}
/**
 * 
 * @param {Number} desiredIncome
 * @param {Number} interestRate
 * @param {Number} retireYears
 * @param {Number} workingYears
 * @returns {Number}
 */
function calcPresentRetireMoneys(desiredIncome, interestRate, retireYears,
        workingYears) {
    var r = interestRate / 100.0;
    var i;
    var moneysAtRetire;
    for (i = 1, moneysAtRetire = 0; i <= retireYears; i++) {
        moneysAtRetire += Math.pow((1 + r), i) - 1;
    }
    moneysAtRetire = desiredIncome * (moneysAtRetire + 1);
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
        return retireAmount;
    } else {
        return netWorthEachYear;
    }
};
function calcFutureValue(principal, interestRate, time) {
    // futureVal = principal * (1 + rate / n) ^ (n*t)
    //             principal = initial investment
    //             rate = interest rate as a decimal, not a percent
    //             n = number of times per year the compounding takes place
    //             t = duration of investment in years
    //
    //             n = 1  for simplicity of demo
    // futureVal = principal * (1 + r) ^ t
    var r = interestRate / 100.0;
    var futureVal = principal * Math.pow((1 + r), time);
    
    return futureVal;
}
