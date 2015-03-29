$(function(){
	$('#calculate').click(function(){
		var form_ok = true;
		var form_value = function (name){
			var el = $('[name=' + name +']');
			console.log(name, el);
			var val = el.val().length > 0 ? el.val(): el.attr('placeholder');
			if (val == undefined){
				el.parent().addClass('has-error');
				form_ok = false;
			}
		};
		var data = {
                               annualDesiredIncome: {
                                   annualIncome: form_value('desired'),
                                   incomeFromAge: form_value('myage'),
                                   incomeToAge: form_value('lifespan')
				},
                               savingsInfo: {
                                   currentSavings: form_value('savings'),
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
		console.log(data);
		if (!form_ok){
			$('#form-error').removeClass('hidden');
			console.log($('#form-error'));
		}else{
			$('#form-error').addClass('hidden');
		}
	});
});
