

(function(global){
	
	var collectionsByInst = {};
	
	try {
		/*Ti.include('/kranium/lib/backbone/kranium-underscore.js');
		Ti.include('/kranium/lib/backbone/kranium-backbone.js');
		Ti.include('/kranium/lib/backbone/kranium-backbone-couchconnector.js');
		Ti.include('/kranium/lib/backbone/kranium-jquery.couch.js');*/
		
		var eventSplitter = /^(\w+)\s*(.*)$/;
		_.extend(Backbone.View.prototype, Backbone.Events, {
			tagName: 'view',
	
			make: function(tagName, attributes, content){
				//Ti.API.log('making', [tagName, attributes, content]);
				return K.create({ type: tagName, attr: attributes, content: content });
			},
	
			delegateEvents: function(events) {
				Ti.API.log('delegately', [events, this.events]);
				if (! (events || (events = this.events))) return;
				$(this.el).unbind();
				for (var key in events) {
					var methodName = events[key];
					var match = key.match(eventSplitter);
					var eventName = match[1],
						selector = match[2];
					var method = _.bind(this[methodName], this);
					Ti.API.log('bindly', [eventName, selector]);
					if (selector === '') {
						$(this.el).bind(eventName, method);
					} else {
						$(this.el).delegate(selector, eventName, method);
					}
				}
			}

		});

		global.BackboneView = View.extend({
			renderCollection: function(){
				var collection = this.getCollection();
				var data = collection.map(function(model){
					K.log('creating', K.extend({ _modelId: model.id }, model.attributes), model.cid);
					return (model.el = K.creators[model.type](K.extend({ _modelId: model.id, _modelCid: model.cid }, model.attributes)));
				});
				
				K.log('rendering collection', data);
				
				this.el.setData(data);
			},
			renderModel: function(model) {
				K.log('rendering model');
				
				var collection = this.getCollection();
				var el = model.el, key;

				var recreate = false,
					changed = model.changedAttributes();

				if(el){
					for(key in changed){
						if(typeof el[key] === 'undefined'){
							recreate = true;
						}
					}
					//K.log('renderModel', changed, el)
					if(!recreate){
						for(key in changed){
							el[key] = changed[key];
						}
					} else {
						var $el = K(el);
						$el.children().remove();
						$el.append((model.el = K.creators[model.type](model.attributes)));
					}
				} else {
					model.el = K.creators[model.type](model.attributes)
				}
				

				collection && collection.sort();
				return this;
			},
			
			onAdd: function(model){
				//this.renderModel(model).el.insertRowBefore(0, model.el);
			},
			
			// Titanium's row handling is BORKEN
			/*updateOrder: function(model){
				//K.log('updateOrder', model.get('order'));
				//K.log(this.collection.pluck('order'));
				var order = model.get('order'),
					$el = K('#' + model.get('id')),
					row = $el[0],
					rows = this.el.data[0].rows;
					
				K.log('rows', rows);	
				for(var i = 0, r; r = rows[i]; i++){
					K.log('comp', [r.order, order, r.order > order])
					if(r.order > order){
						break;
					}
				}
				i > 0 && i--;
				
				if(i == 0){
					K.log('insertbefore', 0);
					this.el.insertRowBefore(0, row);
				} else {
					K.log('insertafter', i);
					this.el.insertRowAfter(i, row);
				}
					
				K.log('going to', i);	
			},*/

			template: function(o){
				//return K.extend({}, this._props, o, { type: this._klass });
			},

			getCollection: function(){
				return collectionsByInst[this._inst];
			},

			init: function(o){
				var collection = o.collection || this.collection;
			
				if(typeof o._inst !== undefined){
					collectionsByInst[o._inst] = collection;
				}
				
				delete this.collection;
				delete o.collection;
				
				
				
				this._super(o);
				
				K.log('this.el', this.el);
				

				
				this.model && this.model.bind('change', this.renderModel.bind(this));
				if(collection){
					this.renderCollection(collection);

					collection.bind('refresh', this.renderCollection.once(this));
					collection.bind('change', this.renderModel.bind(this));
					//this.collection.bind('change:order', this.updateOrder.bind(this));
					collection.bind('add', this.renderCollection.bind(this));


				}

			}

		});
	} catch (e){ Ti.API.error(e); }
})(this);





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

