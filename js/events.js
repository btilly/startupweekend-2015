$(function(){
	var graph_ready = false;
	$('#calculate').click(function(){
		var form_ok = true;
		var form_value = function (name) {
			var el = $('[name=' + name +']');
			var val = el.val().length > 0 ? el.val(): el.attr('placeholder');
			if (val == undefined){
				el.parent().addClass('has-error');
				form_ok = false;
			}else{
				el.parent().removeClass('has-error');
			}
                        return Number(val);
		};
		var data = {
                               annualDesiredIncome: {
                                   annualIncome: form_value('desired') * 1000,
                                   incomeFromAge: form_value('retireage'),
                                   incomeToAge: form_value('lifespan')
				},
                               savingsInfo: {
                                   currentSavings: form_value('savings') * 1000,
                                   savingInterestRate: form_value('interest'),
                                   fromAge: form_value('myage'),
                                   toAge: form_value('retireage')
				},
                               assumptions: {
                                   interestRate: form_value('interest'),
                                   inflationRate: form_value('inflation'),
                                   expectedFromSS: form_value('socialsecurity') //added 
				}
			
		};

		if (!form_ok){
			$('#form-error').removeClass('hidden');
		}else{
			$('#form-error').addClass('hidden');
			var cal = doCal(data);

                        var monthlySavings = cal().toFixed(2);
			$('#saving-answer').html(monthlySavings, 2);
                        
                        // Ben's graph
                        var options = {
                                           initialInvestment: form_value('savings'),
                                           interestRate: form_value('interest') * 1e-2,
                                           savingRate: monthlySavings * 12,
                                           retirementIncome: form_value('desired') * 1000,
                                           incomeFromAge: form_value('myage'),
                                           incomeToAge: form_value('retireage'),
                                           retirementToAge: form_value('lifespan')
                                   };
                        graphData = calcDistribution(options);
                        graphWorthData(graphData);                        

		    $('#question').hide();
                    $('#saving-answer').closest('.hidden').removeClass('hidden');
		    $.recompute_ready = true;
		}
	});
});


