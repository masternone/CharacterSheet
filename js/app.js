var dataLocations = ["archetype","attribute","derived","race","religion","nation","skill","background"],
	options = {};

$(document).ready(function() {
	//Pull and initalize data
	$.when(
		options.utill.dataGet( dataLocations[0] ),
		options.utill.dataGet( dataLocations[1] ),
		options.utill.dataGet( dataLocations[2] ),
		options.utill.dataGet( dataLocations[3] ),
		options.utill.dataGet( dataLocations[4] ),
		options.utill.dataGet( dataLocations[5] ),
		options.utill.dataGet( dataLocations[6] ),
		options.utill.dataGet( dataLocations[7] )
	).then( 
		function( data ){
			// console.log( 'options', options );
			$( dataLocations ).each( function(){
				//initalize all the selects
				options.utill.selectBuild( this );
				if( this == 'attribute' ||
					this == 'derived'   ||
					this == 'skill'
				){
					head.js( 
						'js/' + this + '/table.js',
						'js/' + this + '/function.js'
					);
				}
			});
			// language is not pre populate with data
			head.js( 
				'js/language/table.js',
				'js/language/function.js'
			);
			// if a data location has an additional table build it
			head.ready( function(){
				$( dataLocations ).each( function(){
					if( options && options[this] && options[this].table && typeof( options[this].table ) == 'function' ){
						options[this].table();
					}
				});
				if( options && options.language && options.language.table && typeof( options.language.table ) == 'function' ){
					options.language.table();
				}
			});
			//the nation has to selects and its data is linked to what is selected in the nation select
			options.utill.linkedSelectBuild( 'nation', 'region' );
			//TODO: initalize listner functions
		},
		function(){
			console.log( 'in fail' );
		}
	);

	//initalize listner for selects
	$( 'table#selections td > select' ).change( function(){
		var $this = $( this ),
			source = $this.parent().prop( 'class' ),
			selected = $this.find( ':selected' ).val();
		if( selected == "error" ){
			options[source + 'Selected'] = "error";
		} else {
			// console.log( 'source in change listener', source );
			if( options[source] && options[source].data ){
				$( options[source].data ).each( function(){
					if( this.name == selected ){
						 console.log( 'before calling set function', this );
						options[source + 'Selected'] = this;
						$.each( this, function( key, value ){
							switch( key ){
								case 'region':
									// the nation has to selects and its data is linked to what is selected in the nation select
									options.utill.linkedSelectBuild( 'nation', 'region' );
									break;
								case 'attribute':
									options.attribute.set( source );
									break;
								case 'skill':
									options.skill.set( source );
									break;
								case 'language':
									// console.log( 'source', source );
									// console.log( "options[source + 'Selected']", options[source + 'Selected'] );
									// console.log( "options[source + 'Selected'].language", options[source + 'Selected']['language'] );
									if( options[source + 'Selected'].language && options[source + 'Selected'].language.length > 0 ) options.language.set( source );
									break;
								// Talents
								// TODO:add talent selecting code here
								default:
									console.log( 'selection key not implemented ' + source + '.' + key );
							}
						});
					}
				});
			}
		}
	}).change();
/*
	$( "td.archetype > select" ).change( function(){
		var $this = $( this ),
			selected = $this.find( ':selected' ).val();
		if( selected == "error" ){
			options.archetypeSelected = "error";
		} else {
			for( var i in options.archetype ){
				if( options.archetype[i].name == selected ) break;
			}
			options.archetypeSelected = options.archetype[i];
			skillSet( 'archetype' );
			//talents
			//TODO:add talent selecting code here
		}
	}).change();

	$( "td.religion > select" ).change( function(){
		var $this = $( this ),
			selected = $this.find( ':selected' ).val();
		if( selected == "error" ){
			options.religionSelected = "error";
		} else {
			for( var i in options.religion ){
				if( options.religion[i].name == selected ) break;
			}
			options.religionSelected = options.religion[i];
		}
		$( 'td.archetype > select' ).change();
		$( 'td.background > select' ).change();
	}).change();

	$( "td.background > select" ).change( function(){
		var $this = $( this ),
			selected = $this.find( ':selected' ).val();
		if( selected == "error" ){
			options.backgroundSelected = "error";
		} else {
			for( var i in options.background ){
				if( options.background[i].name == selected ) break;
			}
			options.backgroundSelected = options.background[i];
			skillSet( 'background' );
			//talents
			//TODO:add talent selecting code here
		}
	}).change();
*/
	$( "td.save > input[name='load']" ).click( function(){
		console.log( 'load' );
	});

	$( "td.save > input[name='save']" ).click( function(){
		//grab data from selections table
		var toSave = {
			selections : {
				name : $( 'table#selections td.name input' ).val()
			}
		};
		for( i in dataLocations ){
			toSave.selections[dataLocations[i]] = $( 'table#selections td.' + dataLocations[i] + ' option:selected').val();
		}
		//grab data from attribute table
		for( var i in options.attribute.name ){
			var cleanName = options.attribute.name[i][1];
			if( typeof( toSave.attribute ) != 'object' ) toSave.attribute = {};
			toSave.attribute[cleanName] = {
				score      : $( 'td.' + cleanName + '.score      input' ).val(),
				race       : $( 'td.' + cleanName + '.race       input' ).prop( 'checked' ),
				background : $( 'td.' + cleanName + '.background input' ).prop( 'checked' ),
			}
		};
		//grab data from skill table
		for( var i in options.skill ){
			var cleanName = options.skill[i].name.replace( /[\s()\&]/g, '' );
			if( typeof( toSave.skill ) != 'object' ) toSave.skill = {};
			toSave.skill[cleanName] = {
				archetype   : { 
					value   : $( 'td.' + cleanName + '.archetype  input' ).val(),
					checked : $( 'td.' + cleanName + '.archetype  input' ).prop( 'checked' )
				},
				race        : {
					value   : $( 'td.' + cleanName + '.race       input' ).val(),
					checked : $( 'td.' + cleanName + '.race       input' ).prop( 'checked' )
				},
				region      : {
					value   : $( 'td.' + cleanName + '.region     input' ).val(),
					checked : $( 'td.' + cleanName + '.region     input' ).prop( 'checked' )
				},
				background  : {
					value   : $( 'td.' + cleanName + '.background input' ).val(),
					checked : $( 'td.' + cleanName + '.background input' ).prop( 'checked' )
				},
				spend       : $( 'td.' + cleanName + '.spend      input' ).val(),
			};
		}
		//console.log( JSON.stringify( toSave ));
		//$( 'body' ).empty().text( JSON.stringify( toSave ));
		function characterSave( characterJSON ){
			return $.ajax({
				url      : '/save',
				type     : 'POST',
				dataType : 'json',
				data     : { character : characterJSON },
				async    : true
			}).done( function( data ){
				console.log( arguments );
				//TODO: display a success message
				var ret;
				console.log( "done saveing" );
			}).fail( function( data ){
				//console.log( arguments );
				var returnJSON = JSON.parse( data.responseText );
				$( '<div class="error">' + returnJSON.error + '</div>' ).prependTo('body' );
				switch( returnJSON.errorField ){
					case "name":
						$( 'table#selections td.name' ).addClass( 'error' );
						break;
					default:
						console.log( 'No field is identified witht this error' );
				}
			});
		}
		characterSave( JSON.stringify( toSave ));
	});

	$( "td.save > input[name='load']" ).click( function(){
		//grab character name from selections table
		var toLoad = {
			selections : {
				name : $( 'table#selections td.name input' ).val()
			}
		};

		function characterLoad( characterName ){
			return $.ajax({
				url      : '/load',
				type     : 'POST',
				dataType : 'json',
				data     : { character : characterName },
				async    : true
			}).done( function( data ){
				console.log( arguments );
				//TODO: load data
				var ret;
				console.log( "data recived" );
			}).fail( function( data ){
				//console.log( arguments );
				var returnJSON = JSON.parse( data.responseText );
				$( '<div class="error">' + returnJSON.error + '</div>' ).prependTo('body' );
				switch( returnJSON.errorField ){
					case "name":
						$( 'table#selections td.name' ).addClass( 'error' );
						break;
					default:
						console.log( 'No field is identified witht this error' );
				}
			});
		}
		characterLoad( JSON.stringify( toLoad ));
	});
});