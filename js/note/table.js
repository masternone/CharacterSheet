options = typeof( options ) == 'object' ? options : {};
options.note = typeof( options.note ) == 'object' ? options.note : {};
options.note.table = function(){
	var note = this;
	// only insert the note table after the derived table
	if( $( 'table#language' ).length == 0 ){
		setTimeout( function(){ note.table(); }, 100 );
	} else if( $( 'table#note' ).length == 0 ){
		//build note table
		$( 'table#language' ).after(
			"<table id=note border=1 cellspacing=0 cellpadding=1></table>"
		)
		$( 'table#note' ).append(
			"<thead>" +
				"<tr>" +
					"<th class=name>Notes</th>" +
				"</tr>" +
			"</thead>"
		);
	}
}