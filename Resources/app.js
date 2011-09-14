Ti.include("/kranium/lib/kranium.js");
//Ti.include("jade.js");

K({
	type: 'tabgroup',
	tabs: [{
		title: 'Coffee Demo',
		window: {
			//type: 'window',
			id: 'hu',
			//children: ['label heja']
		}
	}]
}).open();


J('test.jade', {users: { jacob: 'yeah' }}).css({ top: 10, left: 20 }).appendTo('#hu');