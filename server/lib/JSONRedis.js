var path   = require( 'path' ),
	fs     = require( 'fs' ),
	redis  = require( 'redis' ),
	client = redis.createClient();

client.on( 'error', function( error ) {
	console.log( 'Error', error.toString() );
	if( error.toString().indexOf( 'ECONNREFUSED' ) > -1 ){
		client.end();
	}
});

client.on( 'idle', function() {
	console.log( 'inside idle' );
	console.log( 'arguments', arguments );
	console.log( 'ret', ret );
});

var JSONRedis = module.exports = {

	finalJSON     : {},

	sortFunc : function( a, b ){
		var aSplit = a.split( ':' ),
			bSplit = b.split( ':' );
			if( !isNaN( aSplit[aSplit.length - 1] )){
				aSplit[aSplit.length - 1] = aSplit[aSplit.length - 1] * 1;
				bSplit[bSplit.length - 1] = bSplit[bSplit.length - 1] * 1;
			}
			return aSplit[aSplit.length - 1] == bSplit[bSplit.length - 1] ? 0 : ( aSplit[aSplit.length - 1] > bSplit[bSplit.length - 1] ? 1 : -1 );
	},

	toRedis : function( init, payload, callback ){
		payload = typeof( payload ) == 'string' ? JSON.parse( payload ) : payload;
		for( var i in payload ){
			var newInit = init + ':' + i;
			// console.log( 'payload[i]', payload[i] );
			// console.log( 'typeof( payload[i] )', typeof( payload[i] ));
			switch( true ){
				case typeof( i ) == 'string' && typeof( payload[i] ) == 'object':
					console.log( init );
					JSONRedis.toRedis( newInit, payload[i] );
					client.sadd( init, newInit, callback );
					break;
				case typeof( i ) == 'string' && typeof( payload[i] ) != 'object':
					console.log( init );
					client.sadd( init, newInit, callback );
					client.set( newInit, payload[i], callback );
					break;
				default:
					console.log( 'No action defined for key of type: %s and value of type: %s', typeof( i ), typeof( payload[i] ));
			}
		}
		if( client.command_queue.length == 0 && typeof( callback ) == 'function' )
			callback( null, true ); 
	},

	toJSONHelper : function( str, ret, pos ){
		var split = str.split( ':' ).slice( pos ),
			currentItem = split[0],
			nextItem = split[1];
		if( split.length > 2 ){
			if( typeof( ret[currentItem] ) == 'undefined' || ret[currentItem] == null ){
				if( !isNaN( nextItem )){
					ret[currentItem] = [];
				} else {
					ret[currentItem] = {};
				}
			}
			this.toJSONHelper( str, ret[currentItem], pos + 1 );
		} else {
			ret[currentItem] = nextItem;
		}
	},

	toJSON : function( startingPoint, init, loop, callback ){
		if( typeof( loop ) != 'number' ) loop = 0;
		client.type( init, function( error, type ){
			switch( type ){
				case 'set':
					client.smembers( init, function( error, members ){
						if( error ) return callback( error );
						members.sort( this.sortFunc );
						//Continue the current loop
						if( typeof( members[loop + 1] ) != 'undefined' )
							JSONRedis.toJSON( startingPoint, init, loop + 1, callback );
						//start a subloop
						JSONRedis.toJSON( startingPoint, members[loop], 0,  callback );
					});
					break;
				case 'string':
					client.get( init, function( error, value ){
						if( error ) return callback( error );
						JSONRedis.toJSONHelper( init + ':' + value, JSONRedis.finalJSON, 0 );
						// Because idle dose not work the way I think it should I am putting this chaeck in here
						if( client.command_queue.length == 0 && typeof( callback ) == 'function' )
							console.log( 'startingPoint', startingPoint );
							callback( null, JSON.stringify( JSONRedis.finalJSON[startingPoint] ));
					});
					break;
				case 'none':
					callback( null, null );
					break;
				default:
					console.log( 'No action defined for type %s', type );
			}
		});
	},

	loadFile : function( fileName, init, callBack ){

		path.exists( fileName, function( exists ){
			if( !exists ) return false;
			var stream      = fs.createReadStream( fileName ),
				fileContent = '';
			stream.once( 'open', function( fd ){
				stream.on( 'data', function( data ){
					fileContent = fileContent + data;
				});
				stream.on( 'error', function( error ){
					console.log( 'file error: ' + error );
				});
				stream.on( 'end', function(){
					if( typeof( callBack ) == 'function' ){
						callBack( init, fileContent );
					}
				});
			});
		});
	}
}

// console.log( 'process.argv', process.argv );
// switch( process.argv[2] ){ 
// 	case 'set':
// 		JSONRedis.loadFile( process.argv[4], process.argv[3], JSONRedis.toRedis );
// 		break;
// 	case 'get':
// 		JSONRedis.startingPoint = process.argv[3];
// 		JSONRedis.toJSON( JSONRedis.startingPoint, 0, function( error, result ){
// 			console.log( 'result', result );
// 		});
// 		break;
// 	default:
// 		console.log( 'Unknown action ' + process.argv[2] );
// }