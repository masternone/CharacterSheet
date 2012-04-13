options = typeof( options ) == 'object' ? options : {};
options.language = typeof( options.language ) == 'object' ? options.language : {};
options.language.set = function( source ){
	// console.log( 'language set source', source );
	// console.log( 'options[' + source + 'Selected].language', options[source + 'Selected'].language );
	if( source == 'nation' ){
		// If source is nation only do something if native nations is listed in the language table
		$( 'table#language tr' ).each( function(){
			// console.log( $( this ).find( 'td' ).eq( 0 ).text());
			if( $( this ).hasClass( source + 'Select') ){
				options.utill.givenSelect( source, 'language', options[source + 'Selected'].language );
			}
		});
	} else {
		$.each( options[source + 'Selected'].language, function( key, value ){
			var name, literate;
			//console.log( key, value );
			// console.log( "value == 'native nation'", value == 'native nation' );
			// console.log( "options['nationSelected']", options['nationSelected'] );
			if( typeof( value ) == 'string' ){
				name     = value;
				literate = '';
			} else {
				name     = value[0];
				literate = value[1];
			}
			switch( true ){
				case value == 'native nation' && options['nationSelected'] != 'error':
					// If nation is selected before race do something
					// TODO: add selector for national languages
					console.log( 'select a language' );
					break;
				default:
					var nationSelect = value == 'native nation' ? 'nationSelect' : '';
					$( 'table#language' ).append(
						'<tr class="' + source + ' ' + nationSelect + '">' +
							'<td>' + name     + '</td>' +
							'<td>' + literate + '</td>' +
						'</tr>'
					);
			}
		});
	}
}