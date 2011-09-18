exports.Class = View.extend({
	init: function(o){
		
		this.children = [{
			type: 'label',
			width: 100,
			height: 20,
			backgroundColor: '#ff0',
			left: 0,
			text: o.name || 'pettson'
		},
		{
			type: 'label',
			width: 100,
			right: 0,
			text: o.surname || 'findus'
		}];
		
		this._super(o);
		
	}
});