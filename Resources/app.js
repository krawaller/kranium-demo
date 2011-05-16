Ti.include("/kranium/lib/kranium.js");

K({
	type: 'tabgroup',
	tabs: [{
		title: 'Coffee Demo',
		window: {
			children: [{
				type: 'coffeedemo',
				text: 'what goes around'
			}]
		}
	},
	/*{
		title: 'Backbone Demo',
		window: {
			id: 'backbonewindow',
			rightNavButton: {
				systemButton: Titanium.UI.iPhone.SystemButton.ADD,
				click: function(){
					Ti.App.fireEvent('backbonewindowadd', { value: this.editing });
				}
			},
			children: [{
				type: 'backbonedemo'
			}]
		}
	}*/]
}).open();