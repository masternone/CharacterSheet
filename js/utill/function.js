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
	var ret = $( '.' + source[0] ).text() * 1;
	$.each( source, function( key, value ){
		var check = $( '.' + value ).text() * 1;
		ret = Math.min( ret < check );
	});
	return ret;
}

//pull all data files with an AJAX call
options.utill.dataGet = function( type ){
	return $.ajax({
		url: 'data/' + type +'.JSON',
		dataType: 'json',
		async : false
	}).done( function( data ){
		options[type] = typeof( options[type] ) == 'object' ? options[type] : {};
		options[type].data = data;
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
	$( '.' + link + ' > select' ).empty().append( '<option value="error">-select a ' + main + '-</option>' );
	// TODO: when main changes add data to link
	if( options[main + 'Selected'] && options[main + 'Selected'][link] && options[main + 'Selected'][link].length > 0 ){
		$.each( options[main + 'Selected'][link], function( key, value ){
			// console.log( key, value );
			// console.log( this );
			$( '.' + link + ' > select' ).append( '<option value="' + value + '">' + value + '</option>' );
		});
	}
}
options.utill.givenSelect = function( source, table, given ){
	// console.log( 'source', source );
	// console.log( 'table', table );
	// console.log( 'given', given );
	if( $( '#groupSelectModal' ).length == 0 ){
		//build modal
		$( 'body' ).append( '<div class=offClick></div>' );
		$( 'body' ).append( '<div id=groupSelectModal></div>' );
		//Title with countdown
		$( 'div#groupSelectModal' ).append( '<h1>Select ' + table + ' 1</h1>' );
		$( 'div#groupSelectModal' ).append( '<div class=jScrollPane></div>' );
		$( 'div.jScrollPane' ).append( '<table id=groupSelect class=' + table + ' border=1 cellspacing=0 cellpadding=1></table>' );
		$( 'table#' + table + ' thead' ).clone().appendTo( 'table#groupSelect' );
		$.each( given, function(){
			$( 'table#groupSelect' ).append( '<tr></tr>' );
			$.each( this, function(){
				$( 'table#groupSelect tr' ).last().append( '<td>' + this + '</td>' );
			});
			$( 'table#groupSelect tr' ).last().append( '<td class=select>Select</td>' )
		});
		// update main table when selection is made
		$( 'table#groupSelect td.select' ).click( function(){
			// console.log( 'index', $( this ).parent().index());
			$.each( given[$( this ).parent().index()], function( key, value ){
				$( 'table#' + table + ' tr.' + source + 'Select td' ).eq( key ).text( value );
			});
			$( 'body div.offClick, body div#groupSelectModal' ).remove();
		});
		// center the modal on the screen
		$( 'div#groupSelectModal' ).css({
			left : ( $( window ).width()  - $( 'div#groupSelectModal' ).outerWidth( true )) / 2,
			top  : ( $( window ).height() - $( 'div#groupSelectModal' ).outerHeight( true )) / 2
		});
		//enable the scrolling
		$( 'div.jScrollPane' ).jScrollPane({ verticalDragMinHeight: 27, verticalDragMaxHeight: 27, verticalGutter: 10 });
	} else {
		// console.log( 'the modal is already being displayed' );
		setTimeout( function(){ options.utill.givenSelect( source,table, given ); }, 1000 );
	}
}
options.utill.groupSelect = function( table, column ){
	// console.log( 'table', table );
	// console.log( 'column', column );
	if( options[table + 'Groups'] && options[table + 'Groups'].length > 0  && $( '#groupSelectModal' ).length == 0 ){
		var currentGroup,
			cleanName = '';
		if( typeof( options[table + 'Groups'][0] ) == 'string' ){
			//attribute selection is given an array of strings and one can only choose one
			currentGroup = options[table + 'Groups'];
		} else {
			currentGroup = options[table + 'Groups'].shift();
		}
		// console.log( 'currentGroup', currentGroup );
		//build modal
		$( 'body' ).append( '<div class=offClick></div>' );
		$( 'body' ).append( '<div id=groupSelectModal></div>' );
		//Title with countdown
		$( 'div#groupSelectModal' ).append( '<h1>Select ' + table + ' ' + ( options[table + 'Groups'].length + 1 ) + '</h1>' );
		$( 'div#groupSelectModal' ).append( '<div class=jScrollPane></div>' );
		$( 'div.jScrollPane' ).append( '<table id=groupSelect class=' + table + ' border=1 cellspacing=0 cellpadding=1></table>' );
		$( 'table#groupSelect.' + table ).css({ width : $( 'table#' + table ).outerWidth() });
		// console.log( "$( 'table#'" + table + "' thead' )", $( 'table#' + table + ' thead' ));
		$( 'table#' + table + ' thead' ).clone().appendTo( 'table#groupSelect' );
		// console.log( 'currentGroup', currentGroup );
		// console.log( 'currentGroup[0]', currentGroup[0] );
		if( typeof( currentGroup[0] ) == 'string' ){
			while( currentGroup.length > 0 ){
				cleanName = currentGroup.shift().replace( /[\s()\&]/g, '' );
				if( !$( 'table#' + table + ' .' + column + '.' + cleanName + ' > input' ).prop( 'checked' )){
					// console.log( "Math.ceil( $( 'table#groupSelect tr' ).length / 2 % 2 )", Math.ceil( $( 'table#groupSelect tr' ).length / 2 % 2 ));
					$( 'table#' + table + ' tr.' + cleanName ).clone().removeClass( 'even odd' ).addClass( Math.floor( $( 'table#groupSelect tr' ).length / 2 % 2 )  == 0 ? 'odd' : 'even' ).appendTo( 'table#groupSelect' );
				}
			}
		} else {
			$.each( currentGroup, function( key, value ){
				// console.log( key, value );
				// console.log( this );
				cleanName = value.name.replace( /[\s()\&]/g, '' );
				// Only allow one to choos an option if they have not chosen that skill for the current source
				if( !$( 'table#' + table + ' .' + column + '.' + cleanName + ' > input' ).prop( 'checked' )){
					$( 'table#' + table + ' tr.' + cleanName ).clone().removeClass( 'even odd' ).addClass( $( 'table#groupSelect tr' ).length % 2 == 0 ? 'even' : 'odd' ).appendTo( 'table#groupSelect' );
				}
			});
		}
		//allow the user to see how things will change depending on what they are choosing
		$( 'table#groupSelect input[type="number"]' ).prop( 'disabled', true );
		$( 'table#groupSelect .' + column + ' input' ).prop( 'type', 'radio' ).prop( 'name', 'groupSelect' ).prop( 'disabled', false );
		$( 'table#groupSelect .' + column + ' input' ).click( function(){ options[table].finalize( 'table#groupSelect' ); });
		if( options[table + 'Groups'].length > 0 ){
			$( 'div#groupSelectModal' ).append( '<div id=done>Next &raquo;</div>' );
		} else {
			$( 'div#groupSelectModal' ).append( '<div id=done>Done</div>' );
		}
		$( 'div#groupSelectModal div#done' ).click( function(){
			//update the main table if a selection is made else do nothing
			if( $( 'table#groupSelect .' + column + ' > input:checked' ).length > 0 ){
				$( 'table#' + table + ' .' + $( 'table#groupSelect .' + column + ' > input:checked' ).parent().prop( 'class' ).replace( /\s/, '.' ) + ' input' ).prop( 'checked', true );
				$( 'body div.offClick, body div#groupSelectModal' ).remove();
				options.utill.groupSelect( table, column );
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
	} else {
		// console.log( 'column', column );
		// console.log( 'options', options );
		// console.log( "options[column + 'Groups']", options[column + 'Groups'] );
		if( options[table + 'Groups'] && options[table + 'Groups'].length > 0 ) {
			// console.log( 'the modal is already being displayed' );
			setTimeout( function(){ options.utill.groupSelect( table, column ); }, 1000 );
		}
	}
}
