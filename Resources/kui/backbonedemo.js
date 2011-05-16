RowModel = Backbone.Model.extend({
	type: 'tableviewrow'
});

RowCollection = Backbone.Collection.extend({
	// Reference to this collection's model.
	model: RowModel,	
	url: '/todos',
	comparator: function(model) {
		return model.get("created");
	}
});

var todos = new RowCollection();
todos.fetch();

exports.Class = BackboneView.extend({
	type: 'tableview',
	//editing:true,
	editable:true, 
	moveable:false,
	collection: todos,
	onAddClick: function(e){
		var todo = new RowModel({
			title: 'test',
			created: Date.now()
		});
		todos.add(todo);
		todo.save();
	},
	click: function(e){
		
		K.log(e.rowData._modelId)
		var model = todos.get(e.rowData._modelId);
		//K.log('clickety', model.attributes);
		model.set({ hasCheck: !model.get('hasCheck') });
		model.save();
		
	},
	events: {
		app: {
			backbonewindowadd: 'onAddClick'
		},
		
		"delete": function(e){
			K.log('delete', e);
			var model = todos.get(e.rowData._modelId);
			todos.remove(model);
			//model.destroy();
		},
		
		"move": function(e){
			if(e.fromIndex == e.index){ return; }
			var r,
				row = e.row,
				rows = this.data[0].rows,
				index = e.index,
				between = ((after = ((r = rows[index+1]) ? r.order : row.order+1)) - (before = ((r = rows[index-1]) ? r.order : row.order-1)))/2,
				model = todos.get(e.rowData._modelId);
			
			K.log([index, before, between, after])
				
			model.set({ order: between });
			model.save();
			//K.log(_(rows).pluck('order'), between);
			
		}
	}
});

