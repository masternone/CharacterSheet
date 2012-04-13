options = typeof( options ) == 'object' ? options : {};
options.note = typeof( options.note ) == 'object' ? options.note : {};
options.note.set = function( source ){
	// console.log( 'note source', source );
	// console.log( 'options[' + source + 'Selected].note', options[source + 'Selected'].note );
	$.each( options[source + 'Selected'].note, function( key, value ){
		// console.log( key, value );
		// console.log( 'this', this );
		var stripe = $( 'table#note tr' ).length % 2 ? 'odd' : 'even';
		$( 'table#note' ).append( '<tr class=' + stripe + '><td class=' + source + '>' + value + '</td></tr>' );
	});
}