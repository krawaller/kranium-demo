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
			top: 10,
			type: 'tabbedbar',
			backgroundColor: '#0a0',
			labels: ['one', 'two', 'three'],
			click: function(e){
				K.log(e);
			}
		},
		
		{
			top: 80,
			type: 'buttonbar',
			labels: ['one', 'two', 'three'],
			click: function(e){
				K.log(e);
			}
		},
		
		{
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
		}
		
		];
		
		this._super(o);
	}
});