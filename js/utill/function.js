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
