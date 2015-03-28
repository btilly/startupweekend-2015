function doCal(jsonData, whatChanged) {
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