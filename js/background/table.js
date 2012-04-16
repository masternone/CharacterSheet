options = typeof( options ) == 'object' ? options : {};
options.background = typeof( options.background ) == 'object' ? options.background : {};
options.background.table = function(){
	var background = this;
	// only insert the background table after the derived table
	if( $( 'table#language' ).length == 0 ){
		setTimeout( function(){ background.table(); }, 100 );
	} else if( $( 'table#background' ).length == 0 ){
		//build background table
		$( 'table#derived' ).after(
			"<table id=background border=1 cellspacing=0 cellpadding=1></table>"
		)
		$( 'table#background' ).append(
			"<thead>" +
				"<tr>" +
					"<th class=name colspan=2>Background</th>" +
				"</tr>" +
			"</head>"
		);
	}
}
