options = typeof( options ) == 'object' ? options : {};
options.derived = typeof( options.derived ) == 'object' ? options.derived : {};
options.derived.calculate = function( column ){
	var hold = 0,
		pat  = /\s/g,
		replaced;
	$( options.derived.data ).each( function(){
		replaced = this.name[1].replace( pat, '.' );
		$( this[column] ).each( function(){
			if( typeof( this.source ) != 'undefined' ){
				switch( this.combine ){
					case "armorcustom":
						hold = options.utill.armorCustom( this.source );
						break;
					case "addition":
						hold = options.utill.addition( this.source );
						break;
					case "subtraction":
						hold = options.utill.subtraction( this.source );
						break;
					case "multiplucation":
						hold = options.utill.multiplucation( this.source );
						break;
					case "concatinate":
						hold = options.utill.concatinate( this.source );
						break;
					case "minimum":
						hold = options.utill.minimum( this.source );
						break;
					default:
						console.log( 'default combine', this.combine );
				}
				$( '.' + replaced + '.' + column ).html( hold );
			}
		});
	});
}