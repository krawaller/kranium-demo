exports.Class = Window.extend({
	init: function(o){
		
		
		var el = K.createLabel({ text: 'no', top: 10,height: 40, backgroundColor: '#ff0' });
		var parent = K.create({
			type: 'view',
			backgroundColor: '#f00',
			className: 'row',
			height: 100,
			children: [el]
		});
		
		var onClick = function(){ alert('parentClick'); };
		var stuff = K.create({
			type: 'label',
			text: 'sibling',
			height: 40,
			bottom: 10,
			backgroundColor: '#0a0'
		});
		
		K(el)
		    .text('hey')
		    .css({ color: '#f00' })
		    .bind('click', function(){ alert('meclick'); })
		    .parent('.row')
		        .bind('click', onClick)
		        .append(stuff);
		
		
		this.children = [parent];
		
		this._super(o);
	}
});