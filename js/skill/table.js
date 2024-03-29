options = typeof( options ) == 'object' ? options : {};
options.skill = typeof( options.skill ) == 'object' ? options.skill : {};
options.skill.table = function(){
	var skill = this;
	// only insert the skill table after the derived table
	if( $( 'table#derived' ).length == 0 ){
		setTimeout( function(){ skill.table(); }, 100 );
	}
	//build skill table
	$( 'table#derived' ).after(
		"<table id=skill border=1 cellspacing=0 cellpadding=1></table>"
	)
	$( 'table#skill' ).append(
		"<thead>" +
			"<tr>" +
				"<th class=name>Skill Name</th>" +
				"<th class=attribute>Attribute</th>" +
				"<th class=die>Die</th>" +
				"<th class=total>Total</th>" +
				"<th class=archetype>Archetype</th>" +
				"<th class=race>Race</th>" +
				"<th class=nation>Nation</th>" +
				"<th class=background>Background</th>" +
				"<th class=spend>Spend</th>" +
				"<th class=gain>Gain</th>" +
				"<th class=ranks>Ranks</th>" +
				"<th class=other>Other</th>" +
				"<th class=passive>Passive</th>" +
				"<th class=group>Group</th>" +
			"</tr>" +
		"</head>"
	);
	$( options.skill.data ).each( function( i ){
		stripe = i % 2 == 0 ? 'odd' : 'even';
		var cleanName = this.name.replace( /[\s()\&]/g, '' );
		// console.log(cleanName);
		$( 'table#skill' ).append(
			"<tr class='" + cleanName + " " + stripe + "'>" +
				"<td class='" + cleanName + " name'>" + this.name + "</td>" +
				"<td class='" + cleanName + " attribute'></td>" +
				"<td class='" + cleanName + " die'></td>" +
				"<td class='" + cleanName + " total'></td>" +
				"<td class='" + cleanName + " archetype'><input type=checkbox disabled=true value=1 /></td>" +
				"<td class='" + cleanName + " race'><input type=checkbox disabled=true value=1 /></td>" +
				"<td class='" + cleanName + " nation'><input type=checkbox disabled=true value=1 /></td>" +
				"<td class='" + cleanName + " background'><input type=checkbox disabled=true value=1 /></td>" +
				"<td class='" + cleanName + " spend'><input type=number disabled=true maxlength=1 size=1 min=0 max=4 /></td>" +
				"<td class='" + cleanName + " gain'></td>" +
				"<td class='" + cleanName + " ranks'></td>" +
				"<td class='" + cleanName + " other'></td>" +
				"<td class='" + cleanName + " passive'></td>" +
				"<td class='" + cleanName + " group'></td>" +
			"</tr>"
		);
	});
}

options.skill.get = function(){
	var skill = {};
	$.each( options.skill.data, function( key, value ){
		var cleanName = options.utill.cleanName( value.name );
		skill[cleanName] = {
			archetype   : { 
				value   : $( 'td.' + cleanName + '.archetype  input' ).val(),
				checked : $( 'td.' + cleanName + '.archetype  input' ).prop( 'checked' )
			},
			race        : {
				value   : $( 'td.' + cleanName + '.race       input' ).val(),
				checked : $( 'td.' + cleanName + '.race       input' ).prop( 'checked' )
			},
			nation      : {
				value   : $( 'td.' + cleanName + '.nation     input' ).val(),
				checked : $( 'td.' + cleanName + '.nation     input' ).prop( 'checked' )
			},
			background  : {
				value   : $( 'td.' + cleanName + '.background input' ).val(),
				checked : $( 'td.' + cleanName + '.background input' ).prop( 'checked' )
			},
			spend       : $( 'td.' + cleanName + '.spend      input' ).val(),
			other       : $( 'td.' + cleanName + '.other' ).text() * 1
		};
	});
	return skill;
}