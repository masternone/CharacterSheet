options = typeof( options ) == 'object' ? options : {};
options.selection = typeof( options.selection ) == 'object' ? options.selection : {};
options.selection.table = function(){
	var selection = this,
		toSelect = [
				{ name : 'name', type : 'text' },
				{ name : 'race', type : 'select' },
				{ name : 'nation', type : 'select' },
				{ name : 'region', type : 'select' },
				{ name : 'archetype', type : 'select'},
				{ name : 'background', type : 'select' },
				{ name : 'religion', type : 'select' }
		];
	if( $( 'table#selection' ).length == 0 ){
		$( 'body' ).append(
			'<table id=selection border=1 cellspacing=0 cellpadding=1></table>'
		);
		while( toSelect.length > 0 ){
			var current = toSelect.shift(),
				stripe = $( 'table#selection tr' ).length % 2 == 0 ? 'even' : 'odd';
			if( toSelect.length % 2 == 0 ) $( 'table#selection' ).append( '<tr class=' + stripe + '></tr>' );
			$( 'table#selection tr' ).last().append(
				'<td class=' + current.name + '>' + current.name.charAt(0).toUpperCase() + current.name.substr(1) + '</td>' +
				'<td class=' + current.name + '></td>'
			);
			switch( current.type ){
				case 'text':
					$( 'td.' + current.name ).last().append( '<input type=text />' );
					break;
				default:
					$( 'td.' + current.name ).last().append( '<select></select>' );
			}
		}
		// Add the save and load buttons
		$( 'table#selection tr' ).last().append(
			'<td class=save colspan=2>' +
				'<input type=button name=load value=load />' +
				'<input type=button name=save value=save />' +
			'</td>'
		);
	}
}