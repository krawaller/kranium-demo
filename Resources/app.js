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
				'test.jade'.jaded({ 
					users: { 
						jacob: 'yeah', 
						conny: 'hi', 
						aida: 'hello' 
					}
				})
			]
		}
	}]
}).open();

//K.log('jadey', K.stringify();

//J('test.jade', {users: { jacob: 'yeah' }}).css({ top: 10, left: 20 }).appendTo('#hu');