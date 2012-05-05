options = typeof( options ) == 'object' ? options : {};
options.nation = typeof( options.skill ) == 'object' ? options.nation : {};

options.nation.requirement = function( requirements ){
	var hold = [],
		ret = true;
	$.each( requirements, function( key, value){
		$.each( value, function( key, value ){
			// console.log( key, value );
			// console.log( "$( '.nation > select' ).val()", $( '.nation > select' ).val());
			switch( key ){
				case 'true':
					if( $( '.nation > select' ).val() == value ) hold.push( true );
					break;
				case 'false':
					if( $( '.nation > select' ).val() != value ) hold.push( true );
					break;
				default:
					console.log( 'unknown nation requirement', key );
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