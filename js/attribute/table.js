options = typeof( options ) == 'object' ? options : {};
options.attribute = typeof( options.attribute ) == 'object' ? options.attribute : {};
options.attribute.table = function(){
	var attr = this;
	// only insert the attribute table after the selection table
	if( $( 'table#selection' ).length == 0 ){
		setTimeout( function(){ attr.table(); }, 100 );
	}
	//build attribute table
	$( 'table#selection' ).after(
		"<table id=attribute border=1 cellspacing=0 cellpadding=1></table>"
	)
	// Add headers
	$( 'table#attribute' ).append(
		'<thead>' +
			'<tr>' +
				'<th class=abbr>&nbsp;</th>' +
				'<th class=final colspan=2>Final</th>' +
				'<th class=cost>Cost</th>' +
				'<th class=score>Score</th>' +
				'<th class=race>Race</th>' +
				'<th class=background>Background</th>' + 
			'</tr>' +
		'</thead>'
	);
	// build a row for each attribute
	$( attr.data.name ).each( function( i ){
		stripe = i % 2 == 0 ? "odd" : "even"; 
		$( 'table#attribute' ).append(
			"<tr class='" + this[1] + " numbers " + stripe + "'>" +
				"<td class='" + this[1] + " abbr'>" + this[0] + "</td>" +
				"<td class='" + this[1] + " final' colspan=2></td>" +
				"<td class='" + this[1] + " cost'></td>" +
				"<td class='" + this[1] + " score'><input type=number value=2 min=0 max=" + attr.data.cost.length + " maxlength=2 size=2></td>" +
				"<td class='" + this[1] + " race'><input type=checkbox disabled=true value=1 /></td>" +
				"<td class='" + this[1] + " background'><input type=checkbox disabled=true value=1 /></td>" +
			"</tr>" +
			"<tr class='" + this[1] + " derived " + stripe + "'>" +
				"<td class='" + this[1] + " full'>" + this[1] + " </td>" +
				"<td class='" + this[1] + " die'></td>" +
				"<td class='" + this[1] + " passive'></td>" +
				"<td class='" + this[1] + " fill'colspan=4></td>" +
			"</tr>"
		);
	});
	//add a total row
	stripe = ( $( 'table#attribute tr' ).length - 1 ) / 2 % 2 == 0 ? 'odd' : 'even';
	$( 'table#attribute' ).append(
		"<tr class='total numbers " + stripe + "'>" +
			"<td class='total abbr'>total</td>" +
			"<td class='total cost'colspan=3></td>" +
			"<td class='total fill'colspan=3></td>" +
		"</tr>"
	);
}

options.attribute.get = function(){
	var attribute = {};
	$.each( options.attribute.data.name, function( key, value ){
		var cleanName = options.utill.cleanName( value[1] );
		attribute[cleanName] = {
			score      : $( 'td.' + cleanName + '.score      input' ).val(),
			race       : $( 'td.' + cleanName + '.race       input' ).prop( 'checked' ),
			background : $( 'td.' + cleanName + '.background input' ).prop( 'checked' ),
		}
	});
	return attribute;
}