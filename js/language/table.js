options = typeof( options ) == 'object' ? options : {};
options.language = typeof( options.language ) == 'object' ? options.language : {};
options.language.table = function(){
	var language = this;
	// only insert the language table after the derived table
	if( $( 'table#derived' ).length == 0 ){
		setTimeout( function(){ language.table(); }, 100 );
	} else if( $( 'table#language' ).length == 0 ){
		$( 'table#selections' ).after( '<div id=wrapper></div>' );
		$( 'div#wrapper' ).append( $( 'table#attribute, table#derived' ));
		//build language table
		$( 'table#derived' ).after(
			"<table id=language border=1 cellspacing=0 cellpadding=1></table>"
		)
		$( 'table#language' ).append(
			"<thead>" +
				"<tr>" +
					"<th class=name>Language Name</th>" +
					"<th class=attribute>Literate</th>" +
				"</tr>" +
			"</head>"
		);
	}
}