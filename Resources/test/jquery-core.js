(function(){
	
	// To learn how to write Jasmine tests, please read Jasmine documentation:
	// https://github.com/pivotal/jasmine/wiki
	
	// ok
	//^\s*ok\(\s*([^,]+),\s*["]([^"]+)["]\s*\);
	//it("\2", function(){ expect(\1).toBeDefined(); });
	
	// equals
	//^\s*equals\(\s*([^,]+),\s*([^,]+),\s*["]([^"]+)["]\s*\);
	//it("\3", function(){ expect(\1).toEqual(\2); });
	
	// same
	//^\s*same\(\s*([^,]+),\s*([^,]+),\s*["]([^"]+)["]\s*\);
	//it("\3", function(){ expect(\1).toBeSameTiElementsAs(\2); });
		
	beforeEach(function(){
		//Ti.API.log('winchildren', win.children);
				
		this.addMatchers({
			toBeSameTiElementsAs: function(els) {
				
				function getUUID(el){
					return el._uuid;
				}
									
				var thisStr = (Array.isArray(this.actual) ? this.actual : [this.actual]).map(getUUID).join(', '),
					compStr = (Array.isArray(els) ? els : [els]).map(getUUID).join(', ');
															
				return thisStr === compStr;
			}
		});
		
		var els = [];
		Object.keys(K.elsByName).forEach(function(key){
			els.concat(K.elsByName[key]||[]);
		});
		els.forEach(function(el){
			el.getParent().remove(el);
		});
		
		/*(win.children||[]).forEach(function(child){
			win.remove(child);
		});*/
		
		K.reset();
	});
	
	describe('jQuery-Core', function() {

		describe('Basic requirements', function(){
			it('Array.push()', function(){ expect(Array.prototype.push).toBeDefined(); });
			it('Function.apply()', function(){ expect(Function.prototype.apply).toBeDefined(); });
			it('getElementById', function(){ expect(getElementById).toBeDefined(); });
			it('getElementsByTagName', function(){ expect(getElementsByTagName).toBeDefined(); });
			it('RegExp', function(){ expect(RegExp).toBeDefined(); });
			it('K', function(){ expect(K).toBeDefined(); });
		}); 

		describe('K()', function(){
			it("K() === K([])", function(){ expect(K().length).toEqual(0); });
			it("K(undefined) === K([])", function(){ expect(K(undefined).length).toEqual(0); });
			it("K(null) === K([])", function(){ expect(K(null).length).toEqual(0); });
			it("K('') === K([])", function(){ expect(K("").length).toEqual(0); });
			it("K('#') === K([])", function(){ expect(K("#").length).toEqual(0); });
		});
		
		describe('element connectors', function(){			
			it("Free KElement hasn't parentNode", function(){ expect(K({ type: 'label' }).get(0).getParent()).toBeNull(); });
			it("Added KElement has parentNode", function(){ expect(K({ type: 'label' }).appendTo(win).get(0).getParent()._uuid).not.toBeUndefined(); });
			it("Added KElement has correct parentNode", function(){ expect(K({ type: 'label' }).appendTo(win).get(0).getParent()._uuid).toEqual(win._uuid); });
			
		});
		
		var labelBlueprints = [];
		for(var i = 0; i < 6; i++){ labelBlueprints.push({ width: 50, height: 50, top: i*10, left: 10*i, opacity: 0.3, backgroundColor: '#f00', type: 'label', text: i, className: 'lengthTest', id: 'label' + i }); }
		
		describe("length", function () {
		    it("Get Number of Elements Found", function () {
				K(labelBlueprints).appendTo(win);
		        expect(K(".lengthTest", win).length).toEqual(6);
		    });
		});

		describe("size()", function () {
		    it("Get Number of Elements Found", function () {
				K(labelBlueprints).appendTo(win);
		        expect(K(".lengthTest", win).size()).toEqual(6);
		    });
		});

		var getElBlueprints = [
			{ type: 'view', id: 'getView', className: 'getEl', backgroundColor: '#0f0' }, 
			{ type: 'label', id: 'getLabel', text: 'get()', className: 'getEl' }, 
			{ type: 'imageview', id: 'getImageView', className: 'getEl', image: 'http://krawaller.se/logo_mini.png' }
		];
		
		describe("get()", function () {
			it("Get All Elements", function(){
				var els = K(getElBlueprints).appendTo(win);
				expect(els.get()).toBeSameTiElementsAs(K.elsByClassName.getEl);
			});
		});

		describe("toArray()", function () {
			it("Convert K object to an Array", function(){
				var els = K(getElBlueprints).appendTo(win);
				expect(els.toArray()).toBeSameTiElementsAs(K.elsByClassName.getEl);
			});
		});

		describe("get(Number)", function () {
		    it("Get A Single Element", function () {
				K(labelBlueprints).appendTo(win);
		        expect(K("label").get(0)).toBeSameTiElementsAs(getElementById("label0"));
		    });
		
			it("Try get with index larger elements count", function(){
				expect(K('#label0').get(1)).toBeUndefined();
			});
		});

		describe("get(-Number)", function () {
		    it("Get a single element with negative index", function () {
				K(labelBlueprints).appendTo(win);
				var id = labelBlueprints[labelBlueprints.length - 1].id,
					el = getElementById(id);
				
		        expect(K("label").get(-1)).toBeSameTiElementsAs(el);
		    });
		
			it("Try get with index negative index larger then elements count", function(){
				expect(K('#label0').get(-2)).toBeUndefined();
			});
		});

		describe("each(Function)", function () {
		    it('Execute a function, Relative', function () {
				K(labelBlueprints).appendTo(win);

			    var div = K("label");
			    div.each(function () {
			        this.foo = 'zoo';
			    });
			    var pass = true;
			    for (var i = 0; i < div.size(); i++) {
			        if (div.get(i).foo != "zoo") pass = false;
			    }
		        expect(pass).toBeTruthy();
		    });
		});

		describe("slice()", function () {
			var $labels;
			beforeEach(function(){
				$labels = K(labelBlueprints).appendTo(win);
			});

			it("slice(1,2)", function(){
				expect($labels.slice(1,2).get()).toBeSameTiElementsAs(q('label1'));
			});
			it("slice(1)", function(){
				expect($labels.slice(1).get()).toBeSameTiElementsAs(q('label1, label2, label3, label4, label5'));
			});
			it("slice(0,3)", function(){
				expect($labels.slice(0,3).get()).toBeSameTiElementsAs(q('label0, label1, label2'));
			});
			
		    it("slice(-1)", function () {
				var id = labelBlueprints[labelBlueprints.length - 1].id,
					el = q(id);
										
				expect($labels.slice(-1).get()).toBeSameTiElementsAs(el);
		    });
		    it("eq(1)", function () {
		        expect($labels.eq(1).get()).toBeSameTiElementsAs(q(labelBlueprints[1].id));
		    });
		    it("eq('2')", function () {
		        expect($labels.eq('2').get()).toBeSameTiElementsAs(q(labelBlueprints[2].id));
		    });
		    it("eq(-1)", function () {
		        expect($labels.eq(-1).get()).toBeSameTiElementsAs(q(labelBlueprints[labelBlueprints.length - 1].id));
		    });
		});

		describe("first()/last()", function () {
			var $labels,
				$none;
			beforeEach(function(){
				$labels = K(labelBlueprints).appendTo(win);
				$none = K('none');
			});
			
		    it("first()", function () {
		        expect($labels.first().get()).toBeSameTiElementsAs(q("label0"));
		    });
		    it("last()", function () {
		        expect($labels.last().get()).toBeSameTiElementsAs(q("label5"));
		    });
		    it("first() none", function () {
		        expect($none.first().get()).toBeSameTiElementsAs([]);
		    });
		    it("last() none", function () {
		        expect($none.last().get()).toBeSameTiElementsAs([]);
		    });
		});

		/*describe("map()", function () {

		    same(
		    K("#ap").map(function () {
		        return K(this).find("a").get();
		    }).get(), q("google", "groups", "anchor1", "mark"), "Array Map");

		    same(
		    K("#ap > a").map(function () {
		        return this.parentNode;
		    }).get(), q("ap", "ap", "ap"), "Single Map");

		    //for #2616
		    var keys = K.map({
		        a: 1,
		        b: 2
		    }, function (v, k) {
		        return k;
		    });
		    it("Map the keys from a hash to an array", function () {
		        expect(keys.join("")).toEqual("ab");
		    });

		    var values = K.map({
		        a: 1,
		        b: 2
		    }, function (v, k) {
		        return v;
		    });
		    it("Map the values from a hash to an array", function () {
		        expect(values.join("")).toEqual("12");
		    });

		    // object with length prop
		    var values = K.map({
		        a: 1,
		        b: 2,
		        length: 3
		    }, function (v, k) {
		        return v;
		    });
		    it("Map the values from a hash with a length property to an array", function () {
		        expect(values.join("")).toEqual("123");
		    });

		    var scripts = document.getElementsByTagName("script");
		    var mapped = K.map(scripts, function (v, k) {
		        return v;
		    });
		    it("Map an array(-like) to a hash", function () {
		        expect(mapped.length).toEqual(scripts.length);
		    });

		    var flat = K.map(Array(4), function (v, k) {
		        return k % 2 ? k : [k, k, k]; //try mixing array and regular returns
		    });
		    it("try the new flatten technique(#2616)", function () {
		        expect(flat.join("")).toEqual("00012223");
		    });
		});*/
		
		

		/*describe("K.merge()", function () {

		    var parse = K.merge;

		    same(parse([], []), [], "Empty arrays");

		    same(parse([1], [2]), [1, 2], "Basic");
		    same(parse([1, 2], [3, 4]), [1, 2, 3, 4], "Basic");

		    same(parse([1, 2], []), [1, 2], "Second empty");
		    same(parse([], [1, 2]), [1, 2], "First empty");

		    // Fixed at [5998], #3641
		    same(parse([-2, -1], [0, 1, 2]), [-2, -1, 0, 1, 2], "Second array including a zero (falsy)");

		    // After fixing #5527
		    same(parse([], [null, undefined]), [null, undefined], "Second array including null and undefined values");
		    same(parse({
		        length: 0
		    }, [1, 2]), {
		        length: 2,
		        0: 1,
		        1: 2
		    }, "First array like");
		});

		describe("K.extend(Object, Object)", function () {

		    var settings = {
		        xnumber1: 5,
		        xnumber2: 7,
		        xstring1: "peter",
		        xstring2: "pan"
		    },
		        options = {
		            xnumber2: 1,
		            xstring2: "x",
		            xxx: "newstring"
		        },
		        optionsCopy = {
		            xnumber2: 1,
		            xstring2: "x",
		            xxx: "newstring"
		        },
		        merged = {
		            xnumber1: 5,
		            xnumber2: 1,
		            xstring1: "peter",
		            xstring2: "x",
		            xxx: "newstring"
		        },
		        deep1 = {
		            foo: {
		                bar: true
		            }
		        },
		        deep1copy = {
		            foo: {
		                bar: true
		            }
		        },
		        deep2 = {
		            foo: {
		                baz: true
		            },
		            foo2: document
		        },
		        deep2copy = {
		            foo: {
		                baz: true
		            },
		            foo2: document
		        },
		        deepmerged = {
		            foo: {
		                bar: true,
		                baz: true
		            },
		            foo2: document
		        },
		        arr = [1, 2, 3],
		        nestedarray = {
		            arr: arr
		        };

		    K.extend(settings, options);
		    it("Check if extended: settings must be extended", function () {
		        expect(settings).toBe(merged);
		    });
		    it("Check if not modified: options must not be modified", function () {
		        expect(options).toBe(optionsCopy);
		    });

		    K.extend(settings, null, options);
		    it("Check if extended: settings must be extended", function () {
		        expect(settings).toBe(merged);
		    });
		    it("Check if not modified: options must not be modified", function () {
		        expect(options).toBe(optionsCopy);
		    });

		    K.extend(true, deep1, deep2);
		    it("Check if foo: settings must be extended", function () {
		        expect(deep1.foo).toBe(deepmerged.foo);
		    });
		    it("Check if not deep2: options must not be modified", function () {
		        expect(deep2.foo).toBe(deep2copy.foo);
		    });
		    it("Make sure that a deep clone was not attempted on the document", function () {
		        expect(deep1.foo2).toEqual(document);
		    });

		    ok(K.extend(true, {}, nestedarray).arr !== arr, "Deep extend of object must clone child array");

		    // #5991
		    ok(K.isArray(K.extend(true, {
		        arr: {}
		    }, nestedarray).arr), "Cloned array heve to be an Array");
		    ok(K.isPlainObject(K.extend(true, {
		        arr: arr
		    }, {
		        arr: {}
		    }).arr), "Cloned object heve to be an plain object");

		    var empty = {};
		    var optionsWithLength = {
		        foo: {
		            length: -1
		        }
		    };
		    K.extend(true, empty, optionsWithLength);
		    it("The length property must copy correctly", function () {
		        expect(empty.foo).toBe(optionsWithLength.foo);
		    });

		    empty = {};
		    var optionsWithDate = {
		        foo: {
		            date: new Date
		        }
		    };
		    K.extend(true, empty, optionsWithDate);
		    it("Dates copy correctly", function () {
		        expect(empty.foo).toBe(optionsWithDate.foo);
		    });

		    var myKlass = function () {};
		    var customObject = new myKlass();
		    var optionsWithCustomObject = {
		        foo: {
		            date: customObject
		        }
		    };
		    empty = {};
		    K.extend(true, empty, optionsWithCustomObject);
		    it("Custom objects copy correctly (no methods)", function () {
		        expect(empty.foo && empty.foo.date === customObject).toBeDefined();
		    });

		    // Makes the class a little more realistic
		    myKlass.prototype = {
		        someMethod: function () {}
		    };
		    empty = {};
		    K.extend(true, empty, optionsWithCustomObject);
		    it("Custom objects copy correctly", function () {
		        expect(empty.foo && empty.foo.date === customObject).toBeDefined();
		    });

		    var ret = K.extend(true, {
		        foo: 4
		    }, {
		        foo: new Number(5)
		    });
		    it("Wrapped numbers copy correctly", function () {
		        expect(ret.foo == 5).toBeDefined();
		    });

		    var nullUndef;
		    nullUndef = K.extend({}, options, {
		        xnumber2: null
		    });
		    it("Check to make sure null values are copied", function () {
		        expect(nullUndef.xnumber2 === null).toBeDefined();
		    });

		    nullUndef = K.extend({}, options, {
		        xnumber2: undefined
		    });
		    it("Check to make sure undefined values are not copied", function () {
		        expect(nullUndef.xnumber2 === options.xnumber2).toBeDefined();
		    });

		    nullUndef = K.extend({}, options, {
		        xnumber0: null
		    });
		    it("Check to make sure null values are inserted", function () {
		        expect(nullUndef.xnumber0 === null).toBeDefined();
		    });

		    var target = {};
		    var recursive = {
		        foo: target,
		        bar: 5
		    };
		    K.extend(true, target, recursive);
		    it("Check to make sure a recursive obj doesn't go never-ending loop by not copying it over", function () {
		        expect(target).toBe({
		            bar: 5
		        });
		    });

		    var ret = K.extend(true, {
		        foo: []
		    }, {
		        foo: [0]
		    }); // 1907
		    it("Check to make sure a value with coersion 'false' copies over when necessary to fix #1907", function () {
		        expect(ret.foo.length).toEqual(1);
		    });

		    var ret = K.extend(true, {
		        foo: "1,2,3"
		    }, {
		        foo: [1, 2, 3]
		    });
		    it("Check to make sure values equal with coersion (but not actually equal) overwrite correctly", function () {
		        expect(typeof ret.foo != "string").toBeDefined();
		    });

		    var ret = K.extend(true, {
		        foo: "bar"
		    }, {
		        foo: null
		    });
		    it("Make sure a null value doesn't crash with deep extend, for #1908", function () {
		        expect(typeof ret.foo !== 'undefined').toBeDefined();
		    });

		    var obj = {
		        foo: null
		    };
		    K.extend(true, obj, {
		        foo: "notnull"
		    });
		    it("Make sure a null value can be overwritten", function () {
		        expect(obj.foo).toEqual("notnull");
		    });

		    function func() {}
		    K.extend(func, {
		        key: "value"
		    });
		    it("Verify a function can be extended", function () {
		        expect(func.key).toEqual("value");
		    });

		    var defaults = {
		        xnumber1: 5,
		        xnumber2: 7,
		        xstring1: "peter",
		        xstring2: "pan"
		    },
		        defaultsCopy = {
		            xnumber1: 5,
		            xnumber2: 7,
		            xstring1: "peter",
		            xstring2: "pan"
		        },
		        options1 = {
		            xnumber2: 1,
		            xstring2: "x"
		        },
		        options1Copy = {
		            xnumber2: 1,
		            xstring2: "x"
		        },
		        options2 = {
		            xstring2: "xx",
		            xxx: "newstringx"
		        },
		        options2Copy = {
		            xstring2: "xx",
		            xxx: "newstringx"
		        },
		        merged2 = {
		            xnumber1: 5,
		            xnumber2: 1,
		            xstring1: "peter",
		            xstring2: "xx",
		            xxx: "newstringx"
		        };

		    var settings = K.extend({}, defaults, options1, options2);
		    it("Check if extended: settings must be extended", function () {
		        expect(settings).toBe(merged2);
		    });
		    it("Check if not modified: options1 must not be modified", function () {
		        expect(defaults).toBe(defaultsCopy);
		    });
		    it("Check if not modified: options1 must not be modified", function () {
		        expect(options1).toBe(options1Copy);
		    });
		    it("Check if not modified: options2 must not be modified", function () {
		        expect(options2).toBe(options2Copy);
		    });
		});

		describe("K.proxy", function () {

		    var test = function () {
		        equals(this, thisObject, "Make sure that scope is set properly.");
		    };
		    var thisObject = {
		        foo: "bar",
		        method: test
		    };

		    // Make sure normal works
		    test.call(thisObject);

		    // Basic scoping
		    K.proxy(test, thisObject)();

		    // Make sure it doesn't freak out
		    equals(K.proxy(null, thisObject), undefined, "Make sure no function was returned.");

		    // Partial application
		    var test2 = function (a) {
		        equals(a, "pre-applied", "Ensure arguments can be pre-applied.");
		    };
		    K.proxy(test2, null, "pre-applied")();

		    // Partial application w/ normal arguments
		    var test3 = function (a, b) {
		        equals(b, "normal", "Ensure arguments can be pre-applied and passed as usual.");
		    };
		    K.proxy(test3, null, "pre-applied")("normal");

		    // Test old syntax
		    var test4 = {
		        meth: function (a) {
		            equals(a, "boom", "Ensure old syntax works.");
		        }
		    };
		    K.proxy(test4, "meth")("boom");
		});
		
		
		it('get predefined label text', function() {
			expect(K({ type: 'label', text: 'labelText' }).text()).toBe('labelText');
		});	
		
		it('set label text', function() {
			expect(K({ type: 'label' }).text('setLabelText').text()).toBe('setLabelText');
		});*/

	});
	
})();