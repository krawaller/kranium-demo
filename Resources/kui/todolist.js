exports.Class = BackboneView.extend({
	type: 'tableview',
	editable: true, 

	events: {
		click: function(e){
			var model = todos.get(e.rowData._modelId) || todos.getByCid(e.rowData._modelCid);
			model.set({ hasCheck: !model.get('hasCheck') });
		},
		"delete": function(e){
			var model = todos.get(e.rowData._modelId) || todos.getByCid(e.rowData._modelCid);
			todos.remove(model);
		}
	}
});