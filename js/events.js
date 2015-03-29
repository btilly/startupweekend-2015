$(function(){
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

		if (!form_ok){
			$('#form-error').removeClass('hidden');
		}else{
			$('#form-error').addClass('hidden');
			var cal = doCal(data);
			$('#saving-answer').html(cal().toFixed(2), 2)
                        graphWorthData(cal('worthData'))
			$('#saving-answer').closest('.hidden').removeClass('hidden');
			
		}
	});
});

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-61310812-1', 'auto');
  ga('send', 'pageview');

