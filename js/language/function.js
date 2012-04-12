options = typeof( options ) == 'object' ? options : {};
options.language = typeof( options.language ) == 'object' ? options.language : {};
options.language.set = function( source ){
	console.log( 'language set source', source );
	console.log( 'options[' + source + 'Selected].language', options[source + 'Selected'].language );
	$.each( options[source + 'Selected'].language, function( key, value ){
		console.log( key, value );
		console.log( 'this', this );
		switch( true ){
			case value == 'native nation' && options['regionSelected'] != 'error':
				// TODO: add selector for national languages
				console.log( 'select a language' );
				break;
				default:
					$( 'table#language' ).append(
						'<tr>' +
							'<td>' + value + '</td>' +
							'<td></td>' +
						'</tr>'
					);
		}
	} );
}