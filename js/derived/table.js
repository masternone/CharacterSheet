options = typeof( options ) == 'object' ? options : {};
options.derived = typeof( options.derived ) == 'object' ? options.derived : {};
options.derived.table = function(){
	var derived = this;
	// only insert the derived table after the attribute table
	if( $( 'table#attribute' ).length == 0 ){
		setTimeout( function(){ derived.table(); }, 100 );
	}
	//build derived table
	$( 'table#attribute' ).after(
		"<table id=derived border=1 cellspacing=0 cellpadding=1></table>"
	)
	$( 'table#derived' ).append(
		"<tr><th class=abbr>&nbsp;</th><th class=final>Final</th><th class=base>Base</th><th class=race>Race</th><th class=bulk>Bulk</th><th class=shield>Shield</th><th class=other>Other</th></tr>"
	);
	$( derived.data ).each( function( key, value ){
		stripe = key % 2 == 0 ? "even" : "odd"; 
		$( 'table#derived' ).append(
			"<tr class='" + this.name[1] + " numbers " + stripe + "'>" +
				"<td class='" + this.name[1] + " abbr'>" + this.name[0] + "</td>" +
				"<td class='" + this.name[1] + " final'></td>" +
				"<td class='" + this.name[1] + " base'></td>" +
				"<td class='" + this.name[1] + " race'></td>" +
				"<td class='" + this.name[1] + " bulk'></td>" +
				"<td class='" + this.name[1] + " shield'></td>" +
				"<td class='" + this.name[1] + " other'></td>" +
			"</tr>" +
			"<tr class='" + this.name[1] + " derived " + stripe + "'>" +
				"<td class='" + this.name[1] + " full'>" + this.name[1] + " </td>" +
				"<td class='" + this.name[1] + " fill'colspan=7></td>" +
			"</tr>"
		);
	});
}