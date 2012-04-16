options = typeof( options ) == 'object' ? options : {};
options.skill = typeof( options.skill ) == 'object' ? options.skill : {};

options.skill.spend = function(){
// 	if other ranks greater than 1 ranks + spend <= 4
// else spend = 2 ranks = 1
// else spend = 3 ranks = 2
// else error
}
options.skill.set = function( column ){
	var groupCount = 0;
	//skill reset
	$( 'table#skill .' + column + ' input' ).each( function(){
		$( this ).val( 1 ).prop( "checked", false );
	});
	//set
	// console.log( "$( options[column + 'Selected'].skill )", $( options[column + 'Selected'].skill ));
	$( options[column + 'Selected'].skill ).each( function(){
		$.each( this, function( action, actionData ){
			console.log( 'action', action );
			console.log( 'actionData', actionData );
			switch( action ){
				case "specfic":
					var cleanName = this.replace( /[\s()\&]/g, '' );
					console.log( 'cleanName', cleanName );
					console.log( 'input', $( '.' + cleanName + '.' + column + ' > input' ))
					$( '.' + cleanName + '.' + column + ' > input' ).prop( "checked", true );
					break;
				case "linked":
					// linked skils must be later in the list for the divine nerothian to get two ranks in knowledge (religion)
					// this is the only exception to the one rank to a single skill from a single source
					switch( cleanName ){
						case "religion":
							if( options.religionSelected != "error" ){
								var cleanReligionName = options.religionSelected.skill.replace( /[\s()\&]/g, '' );
								if( $( '.' + cleanReligionName + '.' + column + ' > input' ).prop( "checked" ) ){
									$( '.' + cleanReligionName + '.' + column + ' > input' ).val( $( '.' + cleanReligionName + '.' + column + ' > input' ).val() * 1 + 1 );
								}
								$( '.' + cleanReligionName + '.' + column + ' > input' ).prop( "checked", true );
							}
							break;
						default:
							console.log( 'linked skill action unknown', cleanName );
					}
					break;
				case "group":
					$.each( options.skill.data, function(){
						if( this.group == actionData ){
							options.skillGroups[groupCount][skillCount] = this;
							skillCount++;
						}
					});
					break;
				case "choice":
					var skillCount = 0;
					if( typeof( options.skillGroups ) == 'undefined' ) options.skillGroups = new Array();
					if( options.skillGroups[groupCount] && options.skillGroups[groupCount].length > 0 ) groupCount++;
					options.skillGroups[groupCount] = new Array();
					if( typeof( actionData ) == 'string' && actionData == 'any' ){
						options.skillGroups[groupCount] = options.skill.data;
					}
					if( typeof( actionData ) == 'object' ){
						$.each( actionData, function(){
							$.each( this, function( subAction, subActionData ){
								switch( subAction ){
									case "specfic":
										$.each( options.skill.data, function(){
											if( this.name == subActionData ){
												options.skillGroups[groupCount][skillCount] = this;
												skillCount++;
											}
										});
										break;
									case "group":
										$.each( options.skill.data, function(){
											if( this.group == subActionData ){
												options.skillGroups[groupCount][skillCount] = this;
												skillCount++;
											}
										});
										break;
									default:
						 				console.log( 'choice skill action unknown', cc );
								}
							});
						});
					}
					break;
				default:
					console.log( 'skill action unknown', action );
			}
		});
	});
	console.log( 'options.skillGroups', options.skillGroups )
	if( options.skillGroups && options.skillGroups.length > 0 ){
		options.utill.groupSelect( 'skill', column );
	}
	options.skill.finalize();
}
options.skill.finalize = function( table ){
	$( options.skill.data ).each( function(){
		var cleanName = this.name.replace( /[\s()\&]/g, '' );
		$( table + ' .' + cleanName + '.attribute' ).html( $( 'table#attribute .' + this.attribute + '.abbr' ).text());
		$( table + ' .' + cleanName + '.die'       ).html( $( 'table#attribute .' + this.attribute + '.die' ).text());
		$( table + ' .' + cleanName + '.group'     ).html( this.group );
		$( table + ' .' + cleanName + '.ranks'     ).html( 
			$( table + ' .' + cleanName + '.archetype > input'  ).prop( 'checked' ) ? $( table + ' .' + cleanName + '.archetype > input'   ).val() * 1 : 0 +
			$( table + ' .' + cleanName + '.race > input'       ).prop( 'checked' ) ? $( table + ' .' + cleanName + '.race > input'        ).val() * 1 : 0 +
			$( table + ' .' + cleanName + '.region > input'     ).prop( 'checked' ) ? $( table + ' .' + cleanName + '.region > input'      ).val() * 1 : 0 +
			$( table + ' .' + cleanName + '.background > input' ).prop( 'checked' ) ? $( table + ' .' + cleanName + '.background  > input' ).val() * 1 : 0 +
			$( table + ' .' + cleanName + '.gain > input'       ).text() * 1
		);
		$( table + ' .' + cleanName + '.total'     ).html( 
			$( table + ' .' + cleanName + '.ranks' ).text() * 1 +
			$( table + ' .' + cleanName + '.other' ).text() * 1
		);
		$( table + ' .' + cleanName + '.passive'     ).html( 
			$( table + ' .' + cleanName + '.ranks'                    ).text() * 1 +
			$( 'table#attribute .' + this.attribute + '.passive' ).text() * 1 +
			12
		);
	});
}