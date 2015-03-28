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
    var totalIncomes = desiredIncome * numYearsWithIncome;
    
    var currSavings = data.savingsInfo.currentSavings;
    var savingsInterestRate = data.savingsInfo.savingInterestRate;
    var savingsFromAge = data.savingsInfo.fromAge;
    var savingsToAge = data.savingsInfo.toAge;
    var numYearsWithSavings = savingsToAge - savingsFromAge;
    
    var retirementInterestRate = data.assumptions.interestRate;
    var inflationRate = data.assumptions.inflationRate;
    var expectedSS = data.assumptions.expectedFromSS;
    
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
