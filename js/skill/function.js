options = typeof( options ) == 'object' ? options : {};
options.skill = typeof( options.skill ) == 'object' ? options.skill : {};

options.skill.spend = function(){
// 	if other ranks greater than 1 ranks + spend <= 4
// else spend = 2 ranks = 1
// else spend = 3 ranks = 2
// else error
}
options.skill.groupSelect = function( source ){
	if( options.skillGroups.length > 0 ){
		var currentSkillGroup = options.skillGroups.shift(),
			cleanName = '';
		//build modal
		$( 'body' ).append( '<div class=offClick></div>' );
		$( 'body' ).append( '<div id=skillGroupSelectModal></div>' );
		//Title with countdown
		$( 'div#skillGroupSelectModal' ).append( '<h1>Select Skill ' + ( options.skillGroups.length + 1 ) + '</h1>' );
		$( 'div#skillGroupSelectModal' ).append( '<div class=jScrollPane></div>' );
		$( 'div.jScrollPane' ).append( '<table id=skillGroupSelect border=1 cellspacing=0 cellpadding=1></table>' );
		$( 'table#skill thead' ).clone().appendTo( 'table#skillGroupSelect' );
		$.each( currentSkillGroup, function( key, value ){
			cleanName = value.name.replace( /[\s()\&]/g, '' );
			//Only allow one to choos a skill if they have not chosen that skill for the current source
			if( !$( 'table#skill .' + source + '.' + cleanName + ' > input' ).prop( 'checked' )){
				$( 'table#skill tr.' + cleanName ).clone().removeClass( 'even odd' ).addClass( $( 'table#skillGroupSelect tr' ).length % 2 == 0 ? 'even' : 'odd' ).appendTo( 'table#skillGroupSelect' );
			}
		});
		//allow the user to see how things will change depending on what they are choosing
		$( 'table#skillGroupSelect .' + source + ' input' ).prop( 'type', 'radio' ).prop( 'name', 'skillGroupSelect' ).prop( 'disabled', false );
		$( 'table#skillGroupSelect .' + source + ' input' ).click( function(){ options.skill.finalize( 'table#skillGroupSelect' ); });
		if( options.skillGroups.length > 0 ){
			$( 'div#skillGroupSelectModal' ).append( '<div id=done>Next &raquo;</div>' );
		} else {
			$( 'div#skillGroupSelectModal' ).append( '<div id=done>Done</div>' );
		}
		$( 'div#skillGroupSelectModal  div#done' ).click( function(){
			//update the main skill table if a skill is selected else do nothing
			if( $( 'table#skillGroupSelect .' + source + ' > input:checked' ).length > 0 ){
				$( 'table#skill .' + $( 'table#skillGroupSelect .' + source + ' > input:checked' ).parent().prop( 'class' ).replace( /\s/, '.' ) + ' input' ).prop( 'checked', true );
				$( 'body div.offClick, body div#skillGroupSelectModal' ).remove();
				options.skill.groupSelect( source );
				options.skill.finalize( 'table#skill' );
			}
		});
		//center the modal on the screen
		$( 'div#skillGroupSelectModal' ).css({
			left : ( $( window ).width()  - $( 'div#skillGroupSelectModal' ).outerWidth( true )) / 2,
			top  : ( $( window ).height() - $( 'div#skillGroupSelectModal' ).outerHeight( true )) / 2
		});
		//enable the scrolling
		$( 'div.jScrollPane' ).jScrollPane({ verticalDragMinHeight: 27, verticalDragMaxHeight: 27, verticalGutter: 10 });
	}
}
options.skill.set = function( column ){
	var groupCount = 0;
	//skill reset
	$( 'table#skill .' + column + ' input' ).each( function(){
		$( this ).val( 1 ).prop( "checked", false );
	});
	//set
	$( options[column + 'Selected'].skill ).each( function(){
		$.each( this, function( action, actionData ){
			var skillCount = 0;
			if( typeof( options.skillGroups ) == 'undefined' ) options.skillGroups = new Array();
			if( options.skillGroups[groupCount] && options.skillGroups[groupCount].length > 0 ) groupCount++;
			options.skillGroups[groupCount] = new Array();
			switch( action ){
				case "specfic":
					var cleanName = this.replace( /[\s()\&]/g, '' );
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
	//console.log( 'options.skillGroups', options.skillGroups )
	if( options.skillGroups && options.skillGroups.length > 0 ){
		options.skill.groupSelect( column );
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