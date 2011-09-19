// Define model
RowModel = Backbone.Model.extend({
	type: 'tableviewrow'
});

// Define collection
RowCollection = Backbone.Collection.extend({
	model: RowModel,	
	comparator: function(model) {
		return model.get("title");
	}
});

// Create todos collection
todos = new RowCollection();
todos.add([
	{ title: "An example todo" },
	{ title: "Another example todo" },
]);

// Create todolist
var todolist = K.create({
	type: 'todolist',
	collection: todos
});

exports.Class = Window.extend({
	navBarHidden: true,
	init: function(o){
		
		this.titleLabel = K.createLabel({
			className: 'titleLabel'
		});
		todos.bind('all', this.updateTitleLabel.bind(this));
		this.updateTitleLabel();

		this.children = [{
				type: 'toolbar',
				className: 'todoToolbar',
				items: [{
					type: 'textfield',
					className: 'todoInputTextField',
					events: {
						"return": function(e){
							todos.add({ title: e.value });
						}
					}
				},
				'spacer',
				this.titleLabel]
			}, todolist];
		
		this._super(o);
	},
	
	updateTitleLabel: function(){
		var completed = todos.filter(function(m){ return m.get('hasCheck') }).length;
		this.titleLabel.text = completed + ' / ' + todos.length + ' todos';
	}
});