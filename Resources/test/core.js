(function(){
	
	// To learn how to write Jasmine tests, please read Jasmine documentation:
	// https://github.com/pivotal/jasmine/wiki
	
	describe('Core', function() {
		var view = K.createView(),
			label = K.createLabel(),
			button = K.createButton();
			
		describe('methods', function(){
			it('stringify', function(){
				expect(
					K([label, view]).stringify()
				).toEqual('["<label></label>", "<view></view>"]'); 
			});
			
			it('get array of all elements', function(){
				expect(
					K.stringify(
						K(
							[K.createLabel({ text: "get" }), view]
						).get()
					)
				).toEqual('["<label>get</label>", "<view></view>"]'); 
			});
			
			it('get first element found', function(){
				expect(
					K.stringify(
						K(
							[K.createLabel({ text: "get" }), view]
						).get(0)
					)
				).toEqual('"<label>get</label>"');
			});
			
			it('size', function(){
				expect(
					K([label, view, button]).size()
				).toEqual(3);
			});
			
			it('index(element)', function(){
				var view = K.createView();
				expect(
					K([label, view, button]).index(view)
				).toEqual(1);
			});
			
			it('first', function(){
				expect(
					K([view, label, button]).first().stringify()
				).toEqual('["<view></view>"]');
			});
			
			it('last', function(){
				expect(
					K([view, label, button]).last().stringify()
				).toEqual('["<button></button>"]');
			});
			
			it('add', function(){
				expect(
					K([view, label]).add(button).stringify()
				).toEqual('["<view></view>", "<label></label>", "<button></button>"]');
			});
			
			it('find', function(){
				
				expect(
					K({
						type: 'view',
						children: [{
							type: 'label',
							text: 'not'
						},
						{
							type: 'view',
							children: [{
								type: 'label',
								className: 'me',
								text: 'me'
							}]
						}]
					}).find('label.me').stringify()
				).toEqual('["<label class=\'me\'>me</label>"]');
			});
			
			it('closest("selector")', function(){
				expect(
					K({
						type: 'view',
						className: 'view1',
						children: [{
							type: 'label',
							text: 'not'
						},
						{
							type: 'view',
							className: 'view2',
							children: [{
								type: 'label',
								className: 'me',
								text: 'me'
							}]
						}]
					}).find('label.me').closest('view').stringify()
				).toEqual('["<view class=\'view2\'></view>"]');
			});
		}); 
	});
	
})();