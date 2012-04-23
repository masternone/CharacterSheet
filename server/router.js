function route( handle, pathName, response, postData ){
	// console.log( "About to route a request for " + pathName );
	//break up the request into its parts
	var pat = /^(\/(\w*))(\/(\w*))?(\/(.*))?/,
		res = pat.exec( pathName );
	switch( res[2] ){
		case 'js':
		case 'css':
		case 'images':
			handle.dft( response, pathName, postData );
			break;
		case 'data':
			// console.log( 'res', res );
			// console.log( res[6], typeof( res[6] ));
			switch( res[6] ){
				case 'new': //present a form for the data to be saves into
					handle.newData( response, postData, res[4], res[6] );
					break;
				case 'set':
					handle.setData( response, postData, res[4], res[6] );
					break;
				case '':
				case undefined: // get all the data
					handle.getData( response, postData, res[4], res[6] );
					break;
				default:
					console.log( 'Unknown data route %s for %s', res[6], res[4] );
			}
			break
		default:
			if( typeof handle[pathName] === 'function' ){
				handle[pathName]( response, postData );
			} else {
				// console.log( "No request handler found for " + pathName + " using dft.");
				handle.dft( response, pathName, postData );
			}
	}
}

exports.route = route;