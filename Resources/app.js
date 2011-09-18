Ti.include("/kranium/lib/kranium.js");
//Ti.include("jade.js");


Ti.include('underscore.js');
Ti.include('backbone.js');


RowModel = Backbone.Model.extend({
	type: 'tableviewrow'
});

RowCollection = Backbone.Collection.extend({
	// Reference to this collection's model.
	model: RowModel,	
	comparator: function(model) {
		return model.get("title");
	}
});

var todos = new RowCollection();
todos.add({
	title: "finish BB-demo"
});

var bb = K.create({
	type: 'backbonedemo',
	collection: todos
});

setTimeout(function(){
	todos.add({
		title: "weee"
	});
}, 2000);

setTimeout(function(){
	todos.add({
		title: "aaaa"
	});
}, 3000);

setTimeout(function(){
	var m = todos.at(1);
	K.log('keyz', Object.keys(m));
	//m.set({ title: 'wooot' });
	
}, 6000);

K({
	type: 'tabgroup',
	tabs: [{
		title: 'bb',
		window: {
			type: 'window',
			children: [bb]
		}
	}/*,{
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
	}*/]
}).open();
