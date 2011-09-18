Ti.include("/kranium/lib/kranium.js");

K.initBackbone();

K({
	type: 'tabgroup',
	tabs: [{
		title: 'Backbone',
		window: {
			type: 'backbonedemo2'
		}
	},{
		title: 'Coffee',
		window: {
			title: 'Coffee Demo',
			children: [{
				type: 'coffeedemo',
				text: 'What goes around'
			}]
		}
	},{
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
	}]
}).open();
