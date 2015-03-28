/**
 * 
 * @param {String}   jsonData   Format:
 *                              expectedFromSS, //added 
 *                              annualDesiredIncome:
 *                                  annualIncome,
 *                                  inflationRate,
 *                                  incomeFromAge,
 *                                  incomeToAge,
 *                              savingsInfo:
 *                                  savingInterestRate,
 *                                  fromAge,
 *                                  toAge
 *                              assumptions:
 *                                  initInvestments,
 *                                  avgTaxRate,
 *                                  interestRate,
 *                                  capitalGains,
 *                                  taxFreeIncome,
 *                                  dividends
 *     sample:  
 *              {"expectedFromSS":"300",
 *               "annualDesiredIncome":{
 *                                      "retirementInterestRate":"3.5",
 *                                      "incomeFromAge":"65",
 *                                      "incomeToAge":"95"
 *                                      },
 *               "savingsInfo":{
 *                              "savingInterestRate":"0.6",
 *                              "fromAge":"40",
 *                              "toAge":"65"
 *                              },
 *               "assumptions":{
 *                              "initInvestments":"10000",
 *                              "avgTaxRate":"33.3",
 *                              "interestRate":".5",
 *                              "capitalGains":"20.0",
 *                              "taxFreeIncome":"0",
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
