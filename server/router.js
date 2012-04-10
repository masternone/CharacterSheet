function route( handle, pathName, response, postData ){
	console.log( "About to route a request for " + pathName );
	if( typeof handle[pathName] === 'function' ){
		handle[pathName]( response, postData );
	} else {
		console.log( "No request handler found for " + pathName + " using dft.");
		handle.dft( response, pathName, postData );
	}
}

exports.route = route;