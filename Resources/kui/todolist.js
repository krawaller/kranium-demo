// kui/todolist.js

exports.Class = BackboneView.extend({
	type: 'tableview',
	editable: true, 

	events: {
		click: function(e){
			var model = todos.getByCid(e.rowData._modelCid);
			model.set({ hasCheck: !model.get('hasCheck') });
		},
		"delete": function(e){
			var model = todos.getByCid(e.rowData._modelCid);
			todos.remove(model);
		}
	}
});