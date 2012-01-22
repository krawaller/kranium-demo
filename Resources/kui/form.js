exports.Class = function(K, global){
	return K.UI.View.extend({
		className: 'form',

		init: function(o, t){
			var me = this,
				form;

			if(typeof this.success === 'function'){
				this.guardedSuccess = (this.success.guard && this.success.guard(this)) || this.success;
			}
			//K.log('this.sucbef', this.success, this.success.toString())

			var itemCls = this.className || this.cls;
			itemCls = itemCls ? itemCls + ' ' : '';

			switch(this.formtype){
				case 'plain':
				case 'view':
					var rowHeight = me.rowHeight || 28,

					form = {
						type: 'view',
						layout: 'vertical',
						top: 0,
						children: (this.sections||[]).map(function(section){
							var rows = [];

							return {
								type: 'view',
								layout: 'vertical',
								top: 5,
								height: (section.fields || []).length*rowHeight + 20,
								children: (section.fields || []).map(function(field){
									return {
										type: 'view',
										top: 4,
										bottom: 4,
										height: rowHeight,
										className: 'formRow' + (field.rowClass ? ' ' + field.rowClass : ''),
										children: [{
											type: 'label',
											className: 'rowMain',
											text: field.title
										},
										me.createInputField.call(me, field)
										]
									};
								})
							}
						})
					}
					break;

				case 'tableview':
				case 'table':
				default:
					
					var useLabels = typeof this.useLabels !== 'undefined' ? this.useLabels : true;

						var me = this,
						sections = o.sections,
						rowHeight = 70,
						headerHeight = 124;

					if(K.is.ios){
						form = {
							type: 'tableview',
							className: 'bookTable',
							//footerView: footerSpacer,
							/*click: function(e){
								//K.log('clickety!', e);
								var fieldLabel = e.row.children[1];
								if(fieldLabel != e.source){
									fieldLabel.click && fieldLabel.click({});
									if(['textfield', 'textarea'].indexOf(fieldLabel._type) !== -1){
										fieldLabel.focus();
									} 
								}

							},*/
							data: sections.map(function(section, sectionCounter){
								var rows = (section.fields || []).map(function(field, i){

									if(!useLabels){
										field.cls = 'rowMain';
									}

									var obj = {
										className: 'bookRow row' + i,
										visible: typeof field.visible === 'undefined' ? true : field.visible,
										children: [{
											type: 'label',
											className: 'rowMain label' + i,
											text: field.title,
										},
										me.createInputField.call(me, field)
										],
										click: function(){
											var fieldLabel = this.children[1];
											if(fieldLabel){
												fieldLabel.rowClick && fieldLabel.rowClick({});
												if(['textfield', 'textarea'].indexOf(fieldLabel._type) !== -1){
													fieldLabel.focus();
												} 
											}
										}
									};
									if(field.height){
										obj.height = field.height;
									}
									return obj;
								}).filter(function(field){ 
									return field.visible; 
								});

								return {
									type: 'section',
									className: 'section' + sectionCounter,
									headerPlain: section.title,
									rows: [].concat(section.preRows || [], rows, section.postRows || [])
								};
							})
						};
						
						if(o.headerView){
							form.headerView = o.headerView;
						}
						
						if(o.footerView){
							form.footerView = o.footerView;
						}

					} else if(K.is.android){
						var top = 0,
							total = 0,
							children = [],
							h;

						function add(o, h){
							o.height = h + 'dp';
							o.top = top + 'dp';
							top += h;
							children.push(o);
						}

						if(this.headerView){
							add(this.headerView, headerHeight);
						}

						sections.forEach(function(section, si){
							//K.log('creating section', section);
							/*add({
								type: 'view',
								className: 'headerView',
								top: top,
								children: [{
									type: 'label',
									className: 'headerLabel',
									text: section.title,
								}]
							}, headerHeight);*/

							(section.preRows || []).forEach(function(row){
								h = row.height||rowHeight;
								if(!row.type){
									row.type = 'view';
								}
								add(row, h);
							});
							(section.fields || []).forEach(function(field, fi){
								if(!useLabels){
									field.cls = 'rowMain';
								}

								var inputField = me.createInputField.call(me, field),
									visible = typeof field.visible === 'undefined' ? true : field.visible;

								if(!visible){ return; }

								h = field.height||rowHeight;
								return add({
									type: 'view',
									//top: top,
									className: 'formRow',
									visible: visible,
									//height: h + 'dp',
									children: [{
										type: 'label',
										top: 0,
										height: h + 'dp',
										className: 'rowMain',
										text: field.title,
										visible: useLabels
									},
									inputField,
									{
										type: 'view',
										className: 'spacer'
									}],

									click: function(e){
										var fieldLabel = this.children[1];
										if(fieldLabel){
											fieldLabel.rowClick && fieldLabel.rowClick({});
											if(['textfield', 'textarea'].indexOf(fieldLabel._type) !== -1){
												fieldLabel.focus();
											} 
										}

									}
								}, h);
							});
						});

						add({ type: 'view' }, 30); // Bottom spacer

						form = {
							type: 'scrollview',
							className: 'bookTable',
							contentWidth: 'auto',
							contentHeight: 'auto',
							//layout: 'vertical',

							children: children
						};
					}
					break;
			}
						
			this.children = (this.children||[]).concat([form]);
			this.submit = this.submit.bind(this);

			this._super(o);

			this.el.addEventListener('submit', this.submit);
		},


		createInputField: (function(){

			function isNullOrUndefined(value){
				return typeof value === 'undefined' || value === null;
			}

			function getValue(field){
				var value; 
				if(field.save && !isNullOrUndefined(value = K.get(field.key)) ){

				} else if (!isNullOrUndefined(field.value)) {
					value = field.value
				} else {
					value = !isNullOrUndefined(field.def) ? field.def : '';
				}

				return value;
			}

			function fireValue(key, value){
				Ti.App.fireEvent('book:set_' + key, { value: value });
			}

			return K.is.ios ? function(field){

				var fields = this.fields = (this.fields||[]),
					fieldsByKey = this.fieldsByKey = fields.fieldsByKey = (this.fieldsByKey||{}),
					me = this,
					ret,
					type = field.fieldtype;				

				var focusedFieldFn = function(){
						me.focusedField = this;
					},
					blurredFieldFn = function(){
						me.focusedField = null;
					};

				var cls = (field.cls || 'rowSub') + (field.extraCls ? ' ' + field.extraCls : '');
				switch(field.fieldtype){
					case 'date':
					case 'time':
						ret = K.createLabel({
							text: getValue(field),
							className: cls,
							events: field.events,
							click: function(){
								me.focusedField && me.focusedField.blur();

								K({
									type: 'pickermodal',
									pick: type,
									minDate: field.minDate,
									maxDate: field.maxDate,
									excludeDates: field.excludeDates,
									value: field._value||field.value,
									callback: function(value, formatted){
										if(field.save){
											K.set(field.key, value);
										}

										field._value = value;
										field.value = formatted;

										ret.text = formatted;
										fireValue(field.key, value);
									}					
								}).appendTo(me.el);
							}
						});

						break;

					case 'switch':
						ret = K.createSwitch({
							value: getValue(field),
							className: cls,
							events: field.events
						});
						ret.addEventListener('change', function(e){
							field.value = e.value;
						});

						break;


					case 'picker':
						if(field.def === true && !field.value){
							field.value = field.options && field.options[0] && field.options[0].value;
						}
						//K.log('getting default value for', field.key, getValue(field));
						ret = K.createLabel({
							//type: 'label',
							className: cls,
							text: ((field.options[field.options.pluck('value').indexOf(getValue(field))]||{title:field.hintText||''}).title),
							events: field.events,
							click: function(){
								if(!(field.options && field.options.length) ){ return; }

								K.createOptionDialog({
									selectedIndex: field.options.pluck('key').indexOf(getValue(field)),
									title: K.l('pick') + ' ' + field.title.toLowerCase(),
									options: field.options.pluck('title').concat('Avbryt'),
									cancel: field.options.length,
									click: function(e){
										if(e.index == e.source.cancel){ return; }

										ret.text = field.options[e.index].title;
										var value = field.options[e.index].value;
										field.value = value;
										if(field.save){
											K.set(field.key, value);
											//K.log('saving', field.key, value);
										}
										fireValue(field.key, value);
									}
								}).show();
							}
						});
						break;

					default:
						ret = K.create(K.extend({}, field, {
							type: 'textfield',
							className: 'formTextField ' + cls,
							hintText: field.hintText,
							value: getValue(field),
							events: field.events
						}));
						ret.addEventListener('focus', focusedFieldFn);
						ret.addEventListener('blur', function(){
							/*if(field.save){
								K.set(field.key, field.value);
							}*/
							blurredFieldFn();
						});

						ret.addEventListener('change', function(e){
							field.value = this.value;
						});
						break;
				}

				if(field.events && field.events.focus){ ret.addEventListener('focus', field.events.focus); }
				if(field.events && field.events.blur){ ret.addEventListener('blur', field.events.blur); }

				field.value = field.value || getValue(field);
				field.el = ret;
				ret.field = field;
				fields.push(field);
				fieldsByKey[field.key] = field;

				return ret;
			} : function(field){ // Android
					var fields = this.fields = (this.fields||[]),
						fieldsByKey = this.fieldsByKey = fields.fieldsByKey = (this.fieldsByKey||{}),
						me = this,
						ret,
						type = field.fieldtype;

					var cls = (field.cls || 'rowSub') + (field.extraCls ? ' ' + field.extraCls : '');
					switch(field.fieldtype){
						case 'time':
							var value = new Date();
							field.height = 120;

							ret = Ti.UI.createPicker({
								className: 'timePicker ' + cls,
								_type: 'picker',
								type: Ti.UI.PICKER_TYPE_TIME,
								value: field._value||field.value,
								height: field.height + 'dp',
								top: 0,
								right: 10
							});

							ret.addEventListener('change', function(e){
								field._value = e.value;
								field.value = dateFormat(e.value, 'HH:MM');
							});

							break;

						case 'date':
						case 'picker':

							if(field.fieldtype == 'date'){
								var options = [];
								var start = field.minDate,
									end = field.maxDate,
									endStr = end.format('isoDate'),
									dt = new Date(field.minDate),
									options = [],
									i = 0;

								do {
									options.push({
										title: dt.format('isoDate'),
										value: dt.format('isoDate')
									});
									i++;
								} while(dt.setDate(dt.getDate() + 1) && dt.format('isoDate') <= endStr && i < 100);	

								field.options = options;
							}

							if(field.def === true && !field.value){
								field.value = field.options && field.options[0] && field.options[0].value;
							}

							ret = K.createLabel({
								className: cls,
								text: ((field && field.options && (field.options[field.options.pluck('value').indexOf(getValue(field))]||{title:field.hintText||''}).title)||''),
								events: field.events,
								rowClick: function(){
									if(!(field.options && field.options.length) ){ return; }
									K.createOptionDialog({
										selectedIndex: field.options && field.options.pluck('value').indexOf(getValue(field)),
										title: 'Välj ' + field.title.toLowerCase(),
										options: field.options && field.options.pluck('title'),
										click: function(e){
											if(e.index > -1){							
												ret.text = field.options[e.index].title;

												var value = field.options[e.index].value;
												field.value = value;
												if(field.save){
													K.set(field.key, value);
												}
												fireValue(field.key, value);
											}
										}
									}).show();
								}
							});


							break;

						case 'switch':
							ret = K.createSwitch({
								value: getValue(field)||false,
								className: cls,
								events: field.events
							});
							ret.addEventListener('change', function(e){
								field.value = e.value;
							});

							break;

						default:
							ret = K.create(K.extend({}, field, {
								type: 'textfield',
								className: 'formTextField ' + cls,
								hintText: field.hintText,
								value: getValue(field)
							}));
							ret.addEventListener('change', function(e){
								field.value = e.value;
							});

							var onFocus = function(e){ 
								this.value = field.value = '';
								this.removeEventListener('focus', onFocus);
							}
							ret.addEventListener('focus', onFocus);
							break;
					}

					if(field.events && field.events.focus){ ret.addEventListener('focus', field.events.focus); }
					if(field.events && field.events.blur){ ret.addEventListener('blur', field.events.blur); }

					field.value = field.value || getValue(field);
					field.el = ret;
					ret.field = field;
					fields.push(field);
					fieldsByKey[field.key] = field;


					return ret;
				};
		})(),

		submit: function(){		
			this.focusedField && this.focusedField.blur();
			this.guardedSuccess({
				params: this.fields
			});
		}

	});
};