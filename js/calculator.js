/**
 * 
 * @param {String}   jsonData   Format:
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
 * @returns {String}            JSON string = monthlyRequiredSavings
 */

function doCal(jsonData) {
    var data = JSON.parse(jsonData);
    
    var desiredIncome = data.annualDesiredIncome.annualIncome;
    var incomeFromAge = data.annualDesiredIncome.incomeFromAge;
    var incomeToAge = data.annualDesiredIncome.incomeToAge;
    var numYearsWithIncome = incomeToAge - incomeFromAge;
    
    var currSavings = data.savingsInfo.currentSavings;
    var savingsInterestRate = data.savingsInfo.savingInterestRate;
    var savingsFromAge = data.savingsInfo.fromAge;
    var savingsToAge = data.savingsInfo.toAge;
    var numYearsWithSavings = savingsToAge - savingsFromAge;
    
    var retirementInterestRate = data.assumptions.interestRate;
    var inflationRate = data.assumptions.inflationRate;
    var expectedSS = data.assumptions.expectedFromSS;
    var totalIncomes = (desiredIncome - expectedSS) * numYearsWithIncome;
    
    return simpleFunct;
}
var simpleFunct = function() {
    var mustSave = 1000;
    var jsonAnswer = '{"monthlyRequiredSavings":"' + mustSave + '"}';
    return jsonAnswer;
};

var hardFunct = function() {
    var mustSave = 0;
    var jsonAnswer = '{"monthlyRequiredSavings":"' + mustSave + '"}';
    return jsonAnswer;
};

/**
 * Calculate the present value of a some amount in the future to be obtained
 * by compounding annually.
 *
 * @param {number} futureMoney    Final amount desired.
 * @param {number} interestRate   Interest rate in percent
 * @param {number} time           Number of years for the investment.
 * @returns {number}              Present value in dollars
 */
function calcPresentValue(futureMoney, interestRate, time) {
    // presentVal = futureMoney / (1 + rate / n) ^ (n*t)
    //             futureMoney = final amount
    //             rate = interest rate as a decimal, not a percent
    //             n = number of times per year the compounding takes place
    //             t = duration of investment in years
    //
    //             n = 1  for simplicity of demo
    // presentVal = futureMoney * (1 + r) ^ -t
    var r = interestRate / 100.0;
    var foo = Math.pow((1 + r), time);
    var presentVal = futureMoney / foo;
    
    return presentVal;
}
/**
 * Calculate the future value of a principal after compounding annually.
 *
 * @param {number} principal      Amount of initial investment in dollars.
 * @param {number} interestRate   Interest rate in percent
 * @param {number} time           Number of years for the investment.
 * @returns {number}              Future value in dollars
 */
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