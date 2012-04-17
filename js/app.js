var dataLocations = ["archetype","attribute","derived","race","religion","nation","skill","background"],
	options = {};

$(document).ready(function() {
	head.ready( 'selectTable', function(){ options.selection.table(); });
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
				if( options && options.note && options.note.table && typeof( options.note.table ) == 'function' ){
					options.note.table();
				}
				if( options && options.background && options.background.table && typeof( options.background.table ) == 'function' ){
					options.background.table();
				}
			});
			//the nation has to selects and its data is linked to what is selected in the nation select
			options.utill.linkedSelectBuild( 'nation', 'region' );
		},
		function(){
			console.log( 'in fail' );
		}
	);

	//initalize listner for selects
	$( 'table#selection td > select' ).change( function(){
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
						// console.log( 'before calling set function', this );
						if( this.requirement ){
							console.log( 'requirement must be solved first' );
							console.log( this.requirement );
						}
						options[source + 'Selected'] = this;
						$.each( this, function( key, value ){
							switch( key ){
								case 'requirement':
									// do nothing requirement but be solved before this point
								case 'name':
									//do nothing this value is used for display 
									break;
								case 'region':
									// the nation has to selects and its data is linked to what is selected in the nation select
									options.utill.linkedSelectBuild( 'nation', 'region' );
									break;
								case 'military':
									options.background.military( source );
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
									options.language.set( source );
									break;
								case 'note':
									options.note.set( source );
									break;
								case 'talent':
									// Talents
									// TODO:add talent selecting code here
									break;
								// religion these items are are only for requirements
								case 'pantheon':
								case 'portfolio':
									//do nothing
								case 'weapon':
								case 'armor':
									// If source is religion do nothing
									if( source == 'religion' ) break;
								default:
									console.log( 'selection key not implemented ' + source + '.' + key );
							}
						});
					}
				});
			}
		}
	}).change();

	$( "td.save > input[name='load']" ).click( function(){
		console.log( 'load' );
	});

	$( "td.save > input[name='save']" ).click( function(){
		//grab data from selection table
		var toSave = {
			selection : {
				name : $( 'table#selection td.name input' ).val()
			}
		};
		for( i in dataLocations ){
			toSave.selection[dataLocations[i]] = $( 'table#selection td.' + dataLocations[i] + ' option:selected').val();
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
						$( 'table#selection td.name' ).addClass( 'error' );
						break;
					default:
						console.log( 'No field is identified witht this error' );
				}
			});
		}
		characterSave( JSON.stringify( toSave ));
	});

	$( "td.save > input[name='load']" ).click( function(){
		//grab character name from selection table
		var toLoad = {
			selection : {
				name : $( 'table#selection td.name input' ).val()
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
						$( 'table#selection td.name' ).addClass( 'error' );
						break;
					default:
						console.log( 'No field is identified witht this error' );
				}
			});
		}
		characterLoad( JSON.stringify( toLoad ));
	});
});