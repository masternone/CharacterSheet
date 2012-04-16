options = typeof( options ) == 'object' ? options : {};
options.background = typeof( options.background ) == 'object' ? options.background : {};
options.background.military = function( source ){
	$( 'tbale#' + source ).append(
		'<tr>' +
			'<td>Military</<td>' +
			'<td>true</td>' +
		'</tr>' 
	);
}