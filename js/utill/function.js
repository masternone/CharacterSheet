options = typeof( options ) == 'object' ? options : {};
options.utill = typeof( options.utill ) == 'object' ? options.utill : {};
options.utill.armorCustom = function( source ){
	var ret = 0,
		count = 0,
		val;
	for( var i in source ){
		val = $( '.' + source[i] ).text() * 1;
		if( val > 0 ) count++;
		ret = Math.max( ret , val );
	}
	return count > 1 ? ret ++ : ret;
	
}
options.utill.addition = function( source ){
	var ret = 0;
	for( var i in source ){
		if( typeof( source[i] ) == 'number'){
			ret += source[i];
		} else {
			ret += $( '.' + source[i] ).text() * 1;
		}
	}
	return ret;
}
options.utill.subtraction = function( source ){
	var ret = 0;
	for( var i in source ){
		// console.log( source[i], $( '.' + source[i] ).text() * 1 );
		if( i == 0 ){
			if( typeof( source[i] ) == 'number'){
				ret = source[i];
			} else {
				ret = $( '.' + source[i] ).text() * 1;
			}
		} else {
			if( typeof( source[i] ) == 'number'){
				ret -= source[i];
			} else {
				ret -= $( '.' + source[i] ).text() * 1;
			}
		}
	}
	return ret;
}
options.utill.multiplucation = function( source ){
	var ret = 1;
	for( var i in source ){
		if( typeof( source[i] ) == 'number'){
			ret *= source[i];
		} else {
			ret *= $( '.' + source[i] ).text() * 1;
		}
	}
	return ret; 
}
options.utill.concatinate = function( source ){
	var ret = "";
	for( var i in source ){
		if( $( '.' + source[i] ).length > 0 ){
			ret = ret + $( '.' + source[i] ).text();
		} else {
			ret = ret + source[i];
		}
	}
	return ret;
}
options.utill.minimum = function( source ){
	var ret = "Math.min(";
	for( var i in source ){
		ret = ret + $( '.' + source[i] ).text() * 1;
		if( typeof( source[i * 1 + 1] ) != 'undefined' ) ret = ret + ',';
	}
	ret = ret + ')';
	return eval( ret );
}

//pull all data files with an AJAX call
options.utill.dataGet = function( type ){
	return $.ajax({
		url: 'data/' + type +'.JSON',
		dataType: 'json',
		async : false
	}).done( function( data ){
		options[type] = {
			data : data
		}
	});
}

//functions that put content into the the selects
options.utill.selectBuild = function( type ){
	if( $( '.' + type + ' > select' ).length == 1 ){
		$( '.' + type + ' > select' ).append( '<option value="error">-select a ' + type + '-</option>' );
		for( var i in options[type].data ){
			$( '.' + type + ' > select' ).append( '<option value="' + options[type].data[i].name + '">' + options[type].data[i].name + '</option>' );
		}
	}
}
options.utill.linkedSelectBuild = function( main, link ){
	$( '.' + link + ' > select' ).append( '<option val="error">-select a ' + main + '-</option>' );
	//TODO: when main changes add data to link
}
options.utill.groupSelect = function( table, column ){
	// console.log( 'table', table );
	// console.log( 'column', column );
	if( options[column + 'Groups'] && options[column + 'Groups'].length > 0 ){
		var currentGroup,
			cleanName = '';
		if( typeof( options[column + 'Groups'][0] ) == 'string' ){
			//attribute selection is given an array of strings and one can only choose one
			currentGroup = options[column + 'Groups'];
		} else {
			currentGroup = options[column + 'Groups'].shift();
		}
		// console.log( 'currentGroup', currentGroup );
		//build modal
		$( 'body' ).append( '<div class=offClick></div>' );
		$( 'body' ).append( '<div id=groupSelectModal></div>' );
		//Title with countdown
		$( 'div#groupSelectModal' ).append( '<h1>Select ' + column + ' ' + ( options[column + 'Groups'].length + 1 ) + '</h1>' );
		$( 'div#groupSelectModal' ).append( '<div class=jScrollPane></div>' );
		$( 'div.jScrollPane' ).append( '<table id=groupSelect class=' + column + ' border=1 cellspacing=0 cellpadding=1></table>' );
		console.log( "$( 'table#'" + table + "' thead' )", $( 'table#' + table + ' thead' ));
		$( 'table#' + table + ' thead' ).clone().appendTo( 'table#groupSelect' );
		// console.log( currentGroup );
		if( typeof( currentGroup[0] == 'string' )){
			while( currentGroup.length > 0 ){
				cleanName = currentGroup.shift().replace( /[\s()\&]/g, '' );
				if( !$( 'table#' + table + ' .' + column + '.' + cleanName + ' > input' ).prop( 'checked' )){
					$( 'table#' + table + ' tr.' + cleanName ).clone().removeClass( 'even odd' ).addClass( $( 'table#groupSelect tr' ).length % 2 == 0 ? 'even' : 'odd' ).appendTo( 'table#groupSelect' );
				}
			}
		} else {
			$.each( currentGroup, function( key, value ){
				console.log( key, value );
				console.log( this );
				cleanName = value.name.replace( /[\s()\&]/g, '' );
				// Only allow one to choos an option if they have not chosen that skill for the current source
				if( !$( 'table#' + column + ' .' + source + '.' + cleanName + ' > input' ).prop( 'checked' )){
					$( 'table#' + column + ' tr.' + cleanName ).clone().removeClass( 'even odd' ).addClass( $( 'table#groupSelect tr' ).length % 2 == 0 ? 'even' : 'odd' ).appendTo( 'table#groupSelect' );
				}
			});
		}
		//allow the user to see how things will change depending on what they are choosing
		$( 'table#groupSelect .' + column + ' input' ).prop( 'type', 'radio' ).prop( 'name', 'groupSelect' ).prop( 'disabled', false );
		$( 'table#groupSelect .' + column + ' input' ).click( function(){ options[table].finalize( 'table#groupSelect' ); });
		if( options[column + 'Groups'].length > 0 ){
			$( 'div#groupSelectModal' ).append( '<div id=done>Next &raquo;</div>' );
		} else {
			$( 'div#groupSelectModal' ).append( '<div id=done>Done</div>' );
		}
		$( 'div#groupSelectModal  div#done' ).click( function(){
			//update the main skill table if a skill is selected else do nothing
			if( $( 'table#groupSelect .' + source + ' > input:checked' ).length > 0 ){
				$( 'table#' + table + ' .' + $( 'table#groupSelect .' + column + ' > input:checked' ).parent().prop( 'class' ).replace( /\s/, '.' ) + ' input' ).prop( 'checked', true );
				$( 'body div.offClick, body div#groupSelectModal' ).remove();
				options[table].groupSelect( table, column );
				options[table].finalize( 'table#' + table + '' );
			}
		});
		//center the modal on the screen
		$( 'div#groupSelectModal' ).css({
			left : ( $( window ).width()  - $( 'div#groupSelectModal' ).outerWidth( true )) / 2,
			top  : ( $( window ).height() - $( 'div#groupSelectModal' ).outerHeight( true )) / 2
		});
		//enable the scrolling
		$( 'div.jScrollPane' ).jScrollPane({ verticalDragMinHeight: 27, verticalDragMaxHeight: 27, verticalGutter: 10 });
	}
}
