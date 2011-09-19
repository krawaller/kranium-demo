Ti.include("/kranium/lib/kranium.js");

K.initBackbone();

K({
	type: 'tabgroup',
	tabs: [{
		title: 'Shims',
		window: {
			type: 'shims'
		}
	},{
		title: 'Backbone',
		window: {
			type: 'backbonedemo'
		}
	},
	{
		title: 'Coffee',
		window: {
			title: 'Coffee Demo',
			children: [{
				type: 'coffeedemo',
				text: 'What goes around'
			}]
		}
	}].concat(K.is.ios ? [{
			title: 'Jade',
			window: {
				title: 'Jade Demo',
				children: [
					K.jade('test.jade', { 
						users: { 
							jacob: 'yeah',
							david: 'what',
							conny: 'hi', 
							aida: 'hello',
							calle: 'yup'
						}
					})
				]
			}
		}] : [])
}).open();
