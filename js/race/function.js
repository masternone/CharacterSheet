options = typeof( options ) == 'object' ? options : {};
options.race = typeof( options.skill ) == 'object' ? options.race : {};

options.race.requirement = function( requirements ){
	var hold = [],
		ret = true;
	$.each( requirements, function( key, value){
		$.each( value, function( key, value ){
			// console.log( key, value );
			// console.log( "$( '.race > select' ).val()", $( '.race > select' ).val());
			switch( key ){
				case 'true':
					if( $( '.race > select' ).val() == value ) hold.push( true );
					break;
				case 'false':
					if( $( '.race > select' ).val() != value ) hold.push( true );
					break;
				default:
					console.log( 'unknown race requirement', key );
			}
		});
	});
	// console.log( 'hold', hold );
	if( hold.length == 0 ) hold.push( false );
	while( hold.length > 0 ){
		ret = ret && hold.pop();
	}
	return ret;
}