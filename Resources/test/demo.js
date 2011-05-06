(function(){
	
	// To learn how to write Jasmine tests, please read Jasmine documentation:
	// https://github.com/pivotal/jasmine/wiki
	
	describe('Demo', function() {
		describe('Titanium Object', function(){
			it('Ti == Titanium', function(){ expect(Titanium).toEqual(Ti); });
			it('Ti.App', function(){ expect(Titanium).toBeDefined(); });
		}); 

		describe('TabGroup', function(){
			it('Has tabgroup', function(){ expect(K('tabgroup').length).toBeGreaterThan(0); });
			it('TabGroup.activeTab.title === "test"', function(){ expect(K('tabgroup').get(0).activeTab.title).toEqual("test"); });
		});
	});
	
})();