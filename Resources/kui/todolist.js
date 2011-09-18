exports.Class = BackboneView.extend({
	type: 'tableview',
	editable: true, 

	events: {
		"delete": function(e){
			var model = todos.get(e.rowData._modelId) || todos.getByCid(e.rowData._modelCid);
			todos.remove(model);
		}
	}
});