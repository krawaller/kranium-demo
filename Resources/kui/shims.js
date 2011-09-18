exports.Class = Window.extend({
	title: 'Shims',
	navBarHidden: false,
	init: function(o){
		
		this.leftNavButton = {
			title: 'Lefty',
			click: function(e){
				K.log(e);
			}
		};
		
		this.rightNavButton = {
			title: 'Righty',
			click: function(e){
				K.log(e);
			}
		};
		
		this.children = [{
			top: '40dp',
			type: 'tabbedbar',
			height: '40dp',
			backgroundColor: '#0a0',
			index: 0,
			labels: ['one', 'two', 'three'],
			click: function(e){
				K.log(e);
			}
		},
		
		{
			top: '120dp',
			type: 'buttonbar',
			height: '40dp',
			labels: ['one', 'two', 'three'],
			click: function(e){
				K.log(e);
			}
		},
		
		{
			top: '200dp',
			height: '44dp',
			type: 'toolbar',
			items: [
			'spacer',
			{
				type: 'button',
				title: 'a button'
			},
			'spacer',
			{
				type: 'label',
				text: 'hello'
			},
			'spacer'
			]
		},
		
		
		{
			top: '280dp',
			height: '44dp',
			type: 'toolbar',
			items: [
			{
				
				type: 'tabbedbar',
				height: '44dp',
				width: '140dp',
				backgroundColor: '#0a0',
				index: 0,
				labels: ['one', 'two', 'three'],
				click: function(e){
					K.log(e);
				}
			},
			'spacer',
			{
				type: 'buttonbar',
				height: '44dp',
				width: '140dp',
				labels: ['one', 'two', 'three'],
				click: function(e){
					K.log(e);
				}
			}]
		}];
		
		this._super(o);
	}
});