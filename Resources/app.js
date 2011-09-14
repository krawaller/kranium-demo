Ti.include("/kranium/lib/kranium.js");
//Ti.include("jade.js");

K({
	type: 'tabgroup',
	tabs: [{
		title: 'Coffee Demo',
		window: {
			children: [{
				type: 'coffeedemo',
				text: 'What goes around'
			}]
		}
	},{
		title: 'Jade',
		window: {
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