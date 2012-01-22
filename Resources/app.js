var K = require("kranium/init").init({});


K({
	type: 'tabgroup',
	tabs: [{
		title: 'Shims',
		window: {
			type: 'shims'
		}
	},
	// Backbone not ported to 0.2
	/*{
		title: 'Backbone',
		window: {
			type: 'backbonedemo'
		}
	},*/
	{
		title: 'Coffee',
		window: {
			title: 'Coffee Demo',
			children: [{
				type: 'coffeedemo',
				text: 'What goes around'
			}]
		}
	}].concat(true && K.is.ios ? [{
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