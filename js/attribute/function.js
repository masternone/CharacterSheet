options = typeof( options ) == 'object' ? options : {};
options.attribute = typeof( options.attribute ) == 'object' ? options.attribute : {};
// Fill in the final column
options.attribute.finalize = function( name ){
	if( $( '.' + name + '.score > input' ).val() * 1 > 0 && $( '.' + name + '.score > input' ).val() * 1 <= options.attribute.data.cost.length ){
		var raceAdj       = $( '.' + name + '.race > input' ).checked       ? $( '.' + name + '.race > input' ).val() * 1       : 0,
			backgroundAdj = $( '.' + name + '.background > input' ).checked ? $( '.' + name + '.background > input' ).val() * 1 : 0;
		$( '.' + name ).removeClass( 'error' );
		$( '.' + name + '.final' ).html( $( '.' + name + '.score > input' ).val() * 1 + raceAdj + backgroundAdj );
		$( '.' + name + '.die' ).html( options.attribute.data.die[$( '.' + name + '.final' ).text() * 1 - 1] );
		$( '.' + name + '.passive' ).html( options.attribute.data.passive[$( '.' + name + '.final' ).text() * 1 - 1] );
	} else {
		$( '.' + name ).addClass( 'error' );
	}
}
// Update the total spent
options.attribute.total = function(){
	$( '.total.cost' ).html( 0 );
	$( options.attribute.data.name ).each( function(){
		$( '.total.cost' ).html( $( '.total.cost' ).text() * 1 + $( '.' + this[1] + '.cost' ).text() * 1 );
	});
	if( isNaN( $( '.total.cost' ).text() * 1 )){
		$( '.total.numbers' ).addClass( 'error' );
	} else {
		$( '.total.numbers' ).removeClass( 'error' );
	}
}
// function to allow the user to choose an attribute to asign a bonus to
options.attribute.set = function( column ){
	$.each( options[column + 'Selected'].attribute, function(){
		
	}};
}
// function to be run on attribute change
options.attribute.change = function( $this ){
	var result = /^\w*/.exec( $this.parent().attr( 'class' ));
	$( '.' + result[0] + '.cost' ).html( options.attribute.data.cost[ $this.val() * 1 - 1] );
	if( options ){
		if( options.attribute ){
			if( options.attribute.finalize && typeof( options.attribute.finalize ) == 'function' ){ options.attribute.finalize( result[0] ); }
			if( options.attribute.total && typeof( options.attribute.total ) == 'function' ){ options.attribute.total(); }
		} 
		if( options.derived ){
			if( options.derived.calculate && typeof( options.derived.calculate ) == 'function' ){ 
				options.derived.calculate( 'base' );
				options.derived.calculate( 'final' );
			}
		}
		if( options.skill ){
			if( options.skill.finalize && typeof( options.skill.finalize ) == 'function' ){ options.skill.finalize( 'table#skill' ); }
		}
	}
}

// initalize table and assign listner
options.attribute.init = function(){
	if( $( 'table#attribute' ).length > 0 ){
		$( "td.score > input" ).on( 'keyup change blur', function(){ options.attribute.change( $( this ))}).trigger( 'keyup' );
	} else {
		setTimeout( function(){ options.attribute.init(); }, 100 );
	}
}
options.attribute.init();