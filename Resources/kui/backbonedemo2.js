
exports.Class = Window.extend({
	navBarHidden: true,
	init: function(o){
		
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

		// Global on purpose since Titanium cannot handle collections on elements
		todos = new RowCollection();
		todos.add([
			{ title: "An example todo" },
			{ title: "Another example todo" },
		]);

		var todolist = this.todolist = K.create({
			type: 'todolist',
			collection: todos
		});

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
						todos.add({
							title: e.value
						});
					}
				}
			},
			'spacer',
			this.titleLabel]
		}, todolist];
		
		
		this._super(o);
	},
	
	updateTitleLabel: function(){
		this.titleLabel.text = todos.length + ' todos';
	}
	
});

