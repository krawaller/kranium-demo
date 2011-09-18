



//todos.fetch();

exports.Class = BackboneView.extend({
	type: 'tableview',
	//editing:true,
	editable: true, 
	//moveable:false,
	//data: []

	events: {
		"delete": function(e){
			K.log('delete', e);
			var model = todos.get(e.rowData._modelId) || todos.getByCid(e.rowData._modelCid);
			K.log(['modeeel', !!model]);
			todos.remove(model);
			//model.destroy();
		}
	}
	
	//collection: todos
	/*collection: todos,
	data: [],
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
	}*/
});

