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
 *              {"expectedFromSS":"300",
 *               "annualDesiredIncome":{
 *                                      "retirementInterestRate":"3.5",
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
 *                              "initInvestments":"10000",
 *                              "avgTaxRate":"33.3",
 *                              "interestRate":".5",
 *                              "capitalGains":"20.0",
 *                              "taxFreeIncome":"025",
 *                              "dividends":"20"
 *                              }
 *               }
 *
 * @returns {String}            JSON string = monthlyRequiredSavings
 */

function doCal(jsonData) {
    var data = JSON.parse(jsonData);
    
    var ssn = data.expectedFromSSN;
    var desiredIncome = data.annualDesiredIncome;
    var incomeFromAge = data.incomeFromAge;
    var incomeToAge = data.incomeToAge;
    var totalIncomes = 11000;
    
    
    var mustSave = 1000;
    var jsonAnswer = '{"monthlyRequiredSavings":"' + mustSave + '"}';
    return jsonAnswer;
}
