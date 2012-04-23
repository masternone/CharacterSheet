
var save = module.exports = {
	html : '<!DOCTYPE HTML>' +
	'<html>' +
		'<head>' +
			'<title>Save data for << init >></title>' +
			'<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Maven+Pro:400,700">' +
			'<script type="text/javascript" src="/js/head.js"></script>' +
			'<script type="text/javascript">' +
				'head.js({ jQuery : \'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js\' });' +
				'head.ready( \'jQuery\', function(){' +
					'head.js(' +
						'{ utillFuncts : \'/js/utill/function.js\' }' +
					');' +
				'});' +
				'head.ready( \'utillFuncts\', function(){' +
					'options.utill.dataSet( \'<< init >>\', $( \'form\' ));' + 
				'});' +
			'</script>' +
		'</head>' +
		'<body>' +
			'Current << init >> data:<br/>' +
			'<< data >>' +
			'<form action="/data/<< init >>/set" method="POST">' +
				'<textarea id="newData" name="newData" cols="80" rows="40"></textarea><br/>' +
				'<input type="submit" value="Submit"/>' +
				'<input type="reset" value="Cancle"/>' +
			'</form>' +
		'</body>' +
	'</html>'
}