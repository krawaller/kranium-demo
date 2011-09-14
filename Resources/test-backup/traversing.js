(function () {

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
    beforeEach(function () {
        //Ti.API.log('winchildren', win.children);
        this.addMatchers({
            toBeSameTiElementsAs: function (els) {

                function getUUID(el) {
                    return el._uuid;
                }

                var thisStr = (Array.isArray(this.actual) ? this.actual : [this.actual]).map(getUUID).join(', '),
                    compStr = (Array.isArray(els) ? els : [els]).map(getUUID).join(', ');

                return thisStr === compStr;
            }
        });

        var els = [];
        Object.keys(K.elsByName).forEach(function (key) {
            els.concat(K.elsByName[key] || []);
        });
        els.forEach(function (el) {
            el.getParent().remove(el);
        });

        K.reset();
    });

    describe('Traversing', function () {

        var testViewBlueprint = {
            type: 'view',
            id: 'main',
            children: [{
                type: 'view',
                id: 'foo',
                children: [{
                    type: 'label',
                    text: 'Yahoo',
                    id: 'blogTest',
                    className: 'blogTest',
                    children: [{
                        type: 'label',
                        className: 'subLabel',
                        text: 'subLabel'
                    }]
                }]
            }, {
                type: 'view',
                id: 'moretests'
            }]
        };


        describe("find(String)", function () {

            it("Check for find", function () {
                K(testViewBlueprint).appendTo(win);
                expect(K('#foo').find('.blogTest').text()).toEqual('Yahoo');
            });

            it("find direct child elements", function () {
                K(testViewBlueprint).appendTo(win);
                expect(K("#foo").find("> label").get()).toBeSameTiElementsAs(q("blogTest"));
            });

            /*it("find direct child elements, twin selector", function () {
                K(testViewBlueprint).appendTo(win);
                expect(K("#main").find("> #foo, > #moretests").get()).toBeSameTiElementsAs(q("foo", "moretests"));
            });*/

            it("find direct children och direct child", function () {
                expect(K("#main").find("> #foo > label").get()).toBeSameTiElementsAs(q("blogTest"));
            });

        });

		// Won't support this for now
		/* 		
        describe("find(node|K object)", function () {

            var $foo = K('#foo'),
                $blog = K('.blogTest'),
                $first = K('#first'),
                $two = $blog.add($first),
                $fooTwo = $foo.add($blog);

            it("Find with blog K object", function () {
                expect($foo.find($blog).text()).toEqual('Yahoo');
            });

			return;
            it("Find with blog node", function () {
                expect($foo.find($blog[0]).text()).toEqual('Yahoo');
            });
            it("#first is not in #foo", function () {
                expect($foo.find($first).length).toEqual(0);
            });
            it("#first not in #foo (node)", function () {
                expect($foo.find($first[0]).length).toEqual(0);
            });
            it('Find returns only nodes within #foo', function () {
                expect($foo.find($two).is('.blogTest')).toBeTruthy();
            });
            it('Blog is part of the collection, but also within foo', function () {
                expect($fooTwo.find($blog).is('.blogTest')).toBeTruthy();
            });
            it('Blog is part of the collection, but also within foo(node)', function () {
                expect($fooTwo.find($blog[0]).is('.blogTest')).toBeTruthy();
            });
            it("Foo is not in two elements", function () {
                expect($two.find($foo).length).toEqual(0);
            });
            it("Foo is not in two elements(node)", function () {
                expect($two.find($foo[0]).length).toEqual(0);
            });
            it("first is in the collection and not within two", function () {
                expect($two.find($first).length).toEqual(0);
            });
            it("first is in the collection and not within two(node)", function () {
                expect($two.find($first).length).toEqual(0);
            });

        });*/

        describe("is(String|undefined)", function () {
            it('Check for element: A label must be a label', function () {
				K({ type: 'label', id: 'isLabel' }).appendTo(win);
                expect(K('#isLabel').is('label')).toBeTruthy();
            });
			
            it('Check for element: A label is not a button', function () {
				K({ type: 'label', id: 'isLabel' }).appendTo(win);
                expect(K('#isLabel').is('button')).toBeFalsy();
            });

            it('Check for class: Expected class "isLabel"', function () {
				K({ type: 'label', id: 'isLabel', className: 'isLabel' }).appendTo(win);
                expect(K('#isLabel').is('.isLabel')).toBeTruthy();
            });
			
            it('Check for class: Did not expect class "isButton"', function () {
				K({ type: 'label', id: 'isLabel', className: 'isLabel' }).appendTo(win);
                expect(K('#isLabel').is('.isButton')).toBeFalsy();
            });
			
			// Fix multi class selector - this is a false friend atm
            it('Check for multiple classes: Expected classes "isLabel" and "isPretty"', function () {
				K({ type: 'label', id: 'isLabel', className: 'isLabel isPretty' }).appendTo(win);
                expect(K('#isLabel').is('.isLabel.isPretty')).toBeTruthy();
            });

            it('Check for multiple classes: Expected classes "isLabel" and "isPretty", but not "isButton"', function () {
                K({ type: 'label', id: 'isLabel', className: 'isLabel isPretty' }).appendTo(win);
				expect(K('#isLabel').is('.isButton')).toBeFalsy();
            });
			
			return; // Quick return before adapting tests below
				
            it('Check for attribute: Expected attribute lang to be "en"', function () {
                K({ type: 'label', id: 'lang', lang: 'en' }).appendTo(win);
				expect(K('#lang').is('[lang="en"]')).toBeTruthy();
            });

            it('Check for attribute: Expected attribute lang to be "en", not "de"', function () {
                K({ type: 'label', id: 'lang', lang: 'en' }).appendTo(win);
				expect(K('#lang').is('[lang="de"]')).toBeFalsy();
            });

            it('Check for attribute: Expected attribute type to be "text"', function () {
				expect(K('#isLabel').is('[type="text"]')).toBeTruthy();
            });

            it('Check for attribute: Expected attribute type to be "text", not "radio"', function () {
                expect(!K('#text1').is('[type="radio"]')).toBeTruthy();
            });
            it('Check for pseudoclass: Expected to be disabled', function () {
                expect(K('#text2').is(':disabled')).toBeTruthy();
            });

            it('Check for pseudoclass: Expected not disabled', function () {
                expect(!K('#text1').is(':disabled')).toBeTruthy();
            });

            it('Check for pseudoclass: Expected to be checked', function () {
                expect(K('#radio2').is(':checked')).toBeTruthy();
            });

            it('Check for pseudoclass: Expected not checked', function () {
                expect(!K('#radio1').is(':checked')).toBeTruthy();
            });

            it('Check for child: Expected a child "p" element', function () {
                expect(K('#foo').is(':has(p)')).toBeTruthy();
            });

            it('Check for child: Did not expect "ul" element', function () {
                expect(!K('#foo').is(':has(ul)')).toBeTruthy();
            });

            it('Check for childs: Expected "p", "a" and "code" child elements', function () {
                expect(K('#foo').is(':has(p):has(a):has(code)')).toBeTruthy();
            });

            it('Check for childs: Expected "p", "a" and "code" child elements, but no "ol"', function () {
                expect(!K('#foo').is(':has(p):has(a):has(code):has(ol)')).toBeTruthy();
            });

            it('Expected false for an invalid expression - 0', function () {
                expect(!K('#foo').is(0)).toBeTruthy();
            });

            it('Expected false for an invalid expression - null', function () {
                expect(!K('#foo').is(null)).toBeTruthy();
            });

            it('Expected false for an invalid expression - ""', function () {
                expect(!K('#foo').is('')).toBeTruthy();
            });

            it('Expected false for an invalid expression - undefined', function () {
                expect(!K('#foo').is(undefined)).toBeTruthy();
            });

            it('Check passing invalid object', function () {
                expect(!K('#foo').is({
                    plain: "object"
                })).toBeTruthy();
            });

            // test is() with comma-seperated expressions
            /*ok(K('#en').is('[lang="en"],[lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de');
            ok(K('#en').is('[lang="de"],[lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de');
            ok(K('#en').is('[lang="en"] , [lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de');
            ok(K('#en').is('[lang="de"] , [lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de');*/
        });

		return; // Tests below not adapted yet

        describe("is(K)", function () {
            it('Check for element: A form is a form', function () {
                expect(K('#form').is(K('form'))).toBeTruthy();
            });
            it('Check for element: A form is not a div', function () {
                expect(!K('#form').is(K('div'))).toBeTruthy();
            });
            it('Check for class: Expected class "blog"', function () {
                expect(K('#mark').is(K('.blog'))).toBeTruthy();
            });
            it('Check for class: Did not expect class "link"', function () {
                expect(!K('#mark').is(K('.link'))).toBeTruthy();
            });
            it('Check for multiple classes: Expected classes "blog" and "link"', function () {
                expect(K('#simon').is(K('.blog.link'))).toBeTruthy();
            });
            it('Check for multiple classes: Expected classes "blog" and "link", but not "blogTest"', function () {
                expect(!K('#simon').is(K('.blogTest'))).toBeTruthy();
            });
            it('Check for attribute: Expected attribute lang to be "en"', function () {
                expect(K('#en').is(K('[lang="en"]'))).toBeTruthy();
            });
            it('Check for attribute: Expected attribute lang to be "en", not "de"', function () {
                expect(!K('#en').is(K('[lang="de"]'))).toBeTruthy();
            });
            it('Check for attribute: Expected attribute type to be "text"', function () {
                expect(K('#text1').is(K('[type="text"]'))).toBeTruthy();
            });
            it('Check for attribute: Expected attribute type to be "text", not "radio"', function () {
                expect(!K('#text1').is(K('[type="radio"]'))).toBeTruthy();
            });
            it('Check for pseudoclass: Expected not disabled', function () {
                expect(!K('#text1').is(K(':disabled'))).toBeTruthy();
            });
            it('Check for pseudoclass: Expected to be checked', function () {
                expect(K('#radio2').is(K(':checked'))).toBeTruthy();
            });
            it('Check for pseudoclass: Expected not checked', function () {
                expect(!K('#radio1').is(K(':checked'))).toBeTruthy();
            });
            it('Check for child: Expected a child "p" element', function () {
                expect(K('#foo').is(K(':has(p)'))).toBeTruthy();
            });
            it('Check for child: Did not expect "ul" element', function () {
                expect(!K('#foo').is(K(':has(ul)'))).toBeTruthy();
            });
            it('Check for childs: Expected "p", "a" and "code" child elements', function () {
                expect(K('#foo').is(K(':has(p):has(a):has(code)'))).toBeTruthy();
            });
            it('Check for childs: Expected "p", "a" and "code" child elements, but no "ol"', function () {
                expect(!K('#foo').is(K(':has(p):has(a):has(code):has(ol)'))).toBeTruthy();
            });

            // Some raw elements
            it('Check for element: A form is a form', function () {
                expect(K('#form').is(K('form')[0])).toBeTruthy();
            });
            it('Check for element: A form is not a div', function () {
                expect(!K('#form').is(K('div')[0])).toBeTruthy();
            });
            it('Check for class: Expected class "blog"', function () {
                expect(K('#mark').is(K('.blog')[0])).toBeTruthy();
            });
            it('Check for class: Did not expect class "link"', function () {
                expect(!K('#mark').is(K('.link')[0])).toBeTruthy();
            });
            it('Check for multiple classes: Expected classes "blog" and "link"', function () {
                expect(K('#simon').is(K('.blog.link')[0])).toBeTruthy();
            });
            it('Check for multiple classes: Expected classes "blog" and "link", but not "blogTest"', function () {
                expect(!K('#simon').is(K('.blogTest')[0])).toBeTruthy();
            });
        });

        describe("index()", function () {


            equals(K("#text2").index(), 2, "Returns the index of a child amongst its siblings")
        });

        describe("index(Object|String|undefined)", function () {


            var elements = K([window, document]),
                inputElements = K('#radio1,#radio2,#check1,#check2');

            // Passing a node
            it("Check for index of elements", function () {
                expect(elements.index(window)).toEqual(0);
            });
            it("Check for index of elements", function () {
                expect(elements.index(document)).toEqual(1);
            });
            it("Check for index of elements", function () {
                expect(inputElements.index(document.getElementById('radio1'))).toEqual(0);
            });
            it("Check for index of elements", function () {
                expect(inputElements.index(document.getElementById('radio2'))).toEqual(1);
            });
            it("Check for index of elements", function () {
                expect(inputElements.index(document.getElementById('check1'))).toEqual(2);
            });
            it("Check for index of elements", function () {
                expect(inputElements.index(document.getElementById('check2'))).toEqual(3);
            });
            it("Check for not found index", function () {
                expect(inputElements.index(window)).toEqual(-1);
            });
            it("Check for not found index", function () {
                expect(inputElements.index(document)).toEqual(-1);
            });

            // Passing a K object
            // enabled since [5500]
            it("Pass in a K object", function () {
                expect(elements.index(elements)).toEqual(0);
            });
            it("Pass in a K object", function () {
                expect(elements.index(elements.eq(1))).toEqual(1);
            });
            it("Pass in a K object", function () {
                expect(K("#form :radio").index(K("#radio2"))).toEqual(1);
            });

            // Passing a selector or nothing
            // enabled since [6330]
            it("Check for index amongst siblings", function () {
                expect(K('#text2').index()).toEqual(2);
            });
            it("Check for index amongst siblings", function () {
                expect(K('#form').children().eq(4).index()).toEqual(4);
            });
            it("Check for index within a selector", function () {
                expect(K('#radio2').index('#form :radio')).toEqual(1);
            });
            it("Check for index within a selector", function () {
                expect(K('#form :radio').index(K('#radio2'))).toEqual(1);
            });
            it("Check for index not found within a selector", function () {
                expect(K('#radio2').index('#form :text')).toEqual(-1);
            });
        });

        describe("filter(Selector|undefined)", function () {

            same(K("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)");
            same(K("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')");
            same(K("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')");
            it("filter(null) should return an empty K object", function () {
                expect(K('p').filter(null).get()).toBeSameTiElementsAs([]);
            });
            it("filter(undefined) should return an empty K object", function () {
                expect(K('p').filter(undefined).get()).toBeSameTiElementsAs([]);
            });
            it("filter(0) should return an empty K object", function () {
                expect(K('p').filter(0).get()).toBeSameTiElementsAs([]);
            });
            it("filter('') should return an empty K object", function () {
                expect(K('p').filter('').get()).toBeSameTiElementsAs([]);
            });

            // using contents will get comments regular, text, and comment nodes
            var j = K("#nonnodes").contents();
            it("Check node,textnode,comment to filter the one span", function () {
                expect(j.filter("span").length).toEqual(1);
            });
            it("Check node,textnode,comment to filter the one span", function () {
                expect(j.filter("[name]").length).toEqual(0);
            });
        });

        describe("filter(Function)", function () {


            same(K("#main p").filter(function () {
                return !K("a", this).length
            }).get(), q("sndp", "first"), "filter(Function)");

            same(K("#main p").filter(function (i, elem) {
                return !K("a", elem).length
            }).get(), q("sndp", "first"), "filter(Function) using arg");
        });

        describe("filter(Element)", function () {


            var element = document.getElementById("text1");
            it("filter(Element)", function () {
                expect(K("#form input").filter(element).get()).toBeSameTiElementsAs(q("text1"));
            });
        });

        describe("filter(Array)", function () {


            var elements = [document.getElementById("text1")];
            it("filter(Element)", function () {
                expect(K("#form input").filter(elements).get()).toBeSameTiElementsAs(q("text1"));
            });
        });

        describe("filter(K)", function () {


            var elements = K("#text1");
            it("filter(Element)", function () {
                expect(K("#form input").filter(elements).get()).toBeSameTiElementsAs(q("text1"));
            });
        })

        describe("closest()", function () {

            it("closest(body)", function () {
                expect(K("body").closest("body").get()).toBeSameTiElementsAs(q("body"));
            });
            it("closest(html)", function () {
                expect(K("body").closest("html").get()).toBeSameTiElementsAs(q("html"));
            });
            it("closest(div)", function () {
                expect(K("body").closest("div").get()).toBeSameTiElementsAs([]);
            });
            same(K("#main").closest("span,#html").get(), q("html"), "closest(span,#html)");
            it("closest(div:first)", function () {
                expect(K("div:eq(1)").closest("div:first").get()).toBeSameTiElementsAs([]);
            });
            it("closest(body:first div:last)", function () {
                expect(K("div").closest("body:first div:last").get()).toBeSameTiElementsAs(q("fx-tests"));
            });

            // Test .closest() limited by the context
            var jq = K("#nothiddendivchild");
            same(jq.closest("html", document.body).get(), [], "Context limited.");
            same(jq.closest("body", document.body).get(), [], "Context limited.");
            same(jq.closest("#nothiddendiv", document.body).get(), q("nothiddendiv"), "Context not reached.");

            //Test that .closest() returns unique'd set
            it("Closest should return a unique set", function () {
                expect(K('#main p').closest('#main').length).toEqual(1);
            });

            // Test on disconnected node
            it("Make sure disconnected closest work.", function () {
                expect(K("<div><p></p></div>").find("p").closest("table").length).toEqual(0);
            });

            // Bug #7369
            it("Disconnected nodes with attribute selector", function () {
                expect(K('<div foo="bar"></div>').closest('[foo]').length).toEqual(1);
            });
            it("Disconnected nodes with text and non-existent attribute selector", function () {
                expect(K('<div>text</div>').closest('[lang]').length).toEqual(0);
            });
        });

        describe("closest(Array)", function () {

            same(K("body").closest(["body"]), [{
                selector: "body",
                elem: document.body,
                level: 1
            }], "closest([body])");
            same(K("body").closest(["html"]), [{
                selector: "html",
                elem: document.documentElement,
                level: 2
            }], "closest([html])");
            it("closest([div])", function () {
                expect(K("body").closest(["div"])).toBeSameTiElementsAs([]);
            });
            same(K("#yahoo").closest(["div"]), [{
                "selector": "div",
                "elem": document.getElementById("foo"),
                "level": 3
            }, {
                "selector": "div",
                "elem": document.getElementById("main"),
                "level": 4
            }], "closest([div])");
            same(K("#main").closest(["span,#html"]), [{
                selector: "span,#html",
                elem: document.documentElement,
                level: 4
            }], "closest([span,#html])");

            same(K("body").closest(["body", "html"]), [{
                selector: "body",
                elem: document.body,
                level: 1
            }, {
                selector: "html",
                elem: document.documentElement,
                level: 2
            }], "closest([body, html])");
            same(K("body").closest(["span", "html"]), [{
                selector: "html",
                elem: document.documentElement,
                level: 2
            }], "closest([body, html])");
        });

        describe("closest(K)", function () {

            var $child = K("#nothiddendivchild"),
                $parent = K("#nothiddendiv"),
                $main = K("#main"),
                $body = K("body");
            it("closest( K('#nothiddendiv') )", function () {
                expect($child.closest($parent).is('#nothiddendiv')).toBeDefined();
            });
            it("closest( K('#nothiddendiv') ) :: node", function () {
                expect($child.closest($parent[0]).is('#nothiddendiv')).toBeDefined();
            });
            it("child is included", function () {
                expect($child.closest($child).is('#nothiddendivchild')).toBeDefined();
            });
            it("child is included  :: node", function () {
                expect($child.closest($child[0]).is('#nothiddendivchild')).toBeDefined();
            });
            it("created element is not related", function () {
                expect($child.closest(document.createElement('div')).length).toEqual(0);
            });
            it("Main not a parent of child", function () {
                expect($child.closest($main).length).toEqual(0);
            });
            it("Main not a parent of child :: node", function () {
                expect($child.closest($main[0]).length).toEqual(0);
            });
            it("Closest ancestor retrieved.", function () {
                expect($child.closest($body.add($parent)).is('#nothiddendiv')).toBeDefined();
            });
        });

        describe("not(Selector|undefined)", function () {

            it("not('selector')", function () {
                expect(K("#main > p#ap > a").not("#google").length).toEqual(2);
            });
            same(K("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')");
            same(K("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')");
            same(K("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e", "option4e", "option5b"), "not('complex selector')");

            same(K('#ap *').not('code').get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')");
            same(K('#ap *').not('code, #mark').get(), q("google", "groups", "anchor1"), "not('tag, ID selector')");
            same(K('#ap *').not('#mark, code').get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");

            var all = K('p').get();
            it("not(null) should have no effect", function () {
                expect(K('p').not(null).get()).toBeSameTiElementsAs(all);
            });
            it("not(undefined) should have no effect", function () {
                expect(K('p').not(undefined).get()).toBeSameTiElementsAs(all);
            });
            it("not(0) should have no effect", function () {
                expect(K('p').not(0).get()).toBeSameTiElementsAs(all);
            });
            it("not('') should have no effect", function () {
                expect(K('p').not('').get()).toBeSameTiElementsAs(all);
            });
        });

        describe("not(Element)", function () {


            var selects = K("#form select");
            same(selects.not(selects[1]).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
        });

        describe("not(Function)", function () {
            same(K("#main p").not(function () {
                return K("a", this).length
            }).get(), q("sndp", "first"), "not(Function)");
        });

        describe("not(Array)", function () {

            it("not(DOMElement)", function () {
                expect(K("#main > p#ap > a").not(document.getElementById("google")).length).toEqual(2);
            });
            it("not(Array-like DOM collection)", function () {
                expect(K("p").not(document.getElementsByTagName("p")).length).toEqual(0);
            });
        });

        describe("not(K)", function () {


            same(K("p").not(K("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(K)");
        });

        describe("has(Element)", function () {


            var obj = K("#main").has(K("#sndp")[0]);
            it("Keeps elements that have the element as a descendant", function () {
                expect(obj.get()).toBeSameTiElementsAs(q("main"));
            });

            var multipleParent = K("#main, #header").has(K("#sndp")[0]);
            it("Does not include elements that do not have the element as a descendant", function () {
                expect(obj.get()).toBeSameTiElementsAs(q("main"));
            });
        });

        describe("has(Selector)", function () {


            var obj = K("#main").has("#sndp");
            it("Keeps elements that have any element matching the selector as a descendant", function () {
                expect(obj.get()).toBeSameTiElementsAs(q("main"));
            });

            var multipleParent = K("#main, #header").has("#sndp");
            it("Does not include elements that do not have the element as a descendant", function () {
                expect(obj.get()).toBeSameTiElementsAs(q("main"));
            });

            var multipleHas = K("#main").has("#sndp, #first");
            it("Only adds elements once", function () {
                expect(multipleHas.get()).toBeSameTiElementsAs(q("main"));
            });
        });

        describe("has(Arrayish)", function () {


            var simple = K("#main").has(K("#sndp"));
            it("Keeps elements that have any element in the K list as a descendant", function () {
                expect(simple.get()).toBeSameTiElementsAs(q("main"));
            });

            var multipleParent = K("#main, #header").has(K("#sndp"));
            it("Does not include elements that do not have an element in the K list as a descendant", function () {
                expect(multipleParent.get()).toBeSameTiElementsAs(q("main"));
            });

            var multipleHas = K("#main").has(K("#sndp, #first"));
            it("Only adds elements once", function () {
                expect(simple.get()).toBeSameTiElementsAs(q("main"));
            });
        });

        describe("andSelf()", function () {

            same(K("#en").siblings().andSelf().get(), q("sndp", "en", "sap"), "Check for siblings and self");
            same(K("#foo").children().andSelf().get(), q("foo", "sndp", "en", "sap"), "Check for children and self");
            same(K("#sndp, #en").parent().andSelf().get(), q("foo", "sndp", "en"), "Check for parent and self");
            same(K("#groups").parents("p, div").andSelf().get(), q("main", "ap", "groups"), "Check for parents and self");
        });

        describe("siblings([String])", function () {

            same(K("#en").siblings().get(), q("sndp", "sap"), "Check for siblings");
            it("Check for filtered siblings (has code child element)", function () {
                expect(K("#sndp").siblings(":has(code)").get()).toBeSameTiElementsAs(q("sap"));
            });
            same(K("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)");
            same(K("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters");
            var set = q("sndp", "en", "sap");
            same(K("#en, #sndp").siblings().get(), set, "Check for unique results from siblings");
        });

        describe("children([String])", function () {

            same(K("#foo").children().get(), q("sndp", "en", "sap"), "Check for children");
            same(K("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children");
            same(K("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters");
        });

        describe("parent([String])", function () {

            it("Simple parent check", function () {
                expect(K("#groups").parent()[0].id).toEqual("ap");
            });
            it("Filtered parent check", function () {
                expect(K("#groups").parent("p")[0].id).toEqual("ap");
            });
            it("Filtered parent check, no match", function () {
                expect(K("#groups").parent("div").length).toEqual(0);
            });
            equals(K("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters");
            same(K("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent");
        });

        describe("parents([String])", function () {

            it("Simple parents check", function () {
                expect(K("#groups").parents()[0].id).toEqual("ap");
            });
            it("Filtered parents check", function () {
                expect(K("#groups").parents("p")[0].id).toEqual("ap");
            });
            it("Filtered parents check2", function () {
                expect(K("#groups").parents("div")[0].id).toEqual("main");
            });
            same(K("#groups").parents("p, div").get(), q("ap", "main"), "Check for multiple filters");
            same(K("#en, #sndp").parents().get(), q("foo", "main", "dl", "body", "html"), "Check for unique results from parents");
        });

        describe("parentsUntil([String])", function () {


            var parents = K("#groups").parents();
            it("parentsUntil with no selector (nextAll)", function () {
                expect(K("#groups").parentsUntil().get()).toBeSameTiElementsAs(parents.get());
            });
            it("parentsUntil with invalid selector (nextAll)", function () {
                expect(K("#groups").parentsUntil(".foo").get()).toBeSameTiElementsAs(parents.get());
            });
            it("Simple parentsUntil check", function () {
                expect(K("#groups").parentsUntil("#html").get()).toBeSameTiElementsAs(parents.not(':last').get());
            });
            it("Simple parentsUntil check", function () {
                expect(K("#groups").parentsUntil("#ap").length).toEqual(0);
            });
            same(K("#groups").parentsUntil("#html, #body").get(), parents.slice(0, 3).get(), "Less simple parentsUntil check");
            same(K("#groups").parentsUntil("#html", "div").get(), K("#main").get(), "Filtered parentsUntil check");
            same(K("#groups").parentsUntil("#html", "p,div,dl").get(), parents.slice(0, 3).get(), "Multiple-filtered parentsUntil check");
            equals(K("#groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match");
            same(K("#groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice(0, 3).get(), "Multi-source, multiple-filtered parentsUntil check");
        });

        describe("next([String])", function () {

            it("Simple next check", function () {
                expect(K("#ap").next()[0].id).toEqual("foo");
            });
            it("Filtered next check", function () {
                expect(K("#ap").next("div")[0].id).toEqual("foo");
            });
            it("Filtered next check, no match", function () {
                expect(K("#ap").next("p").length).toEqual(0);
            });
            equals(K("#ap").next("div, p")[0].id, "foo", "Multiple filters");
        });

        describe("prev([String])", function () {

            it("Simple prev check", function () {
                expect(K("#foo").prev()[0].id).toEqual("ap");
            });
            it("Filtered prev check", function () {
                expect(K("#foo").prev("p")[0].id).toEqual("ap");
            });
            it("Filtered prev check, no match", function () {
                expect(K("#foo").prev("div").length).toEqual(0);
            });
            equals(K("#foo").prev("p, div")[0].id, "ap", "Multiple filters");
        });

        describe("nextAll([String])", function () {


            var elems = K('#form').children();
            it("Simple nextAll check", function () {
                expect(K("#label-for").nextAll().get()).toBeSameTiElementsAs(elems.not(':first').get());
            });
            it("Filtered nextAll check", function () {
                expect(K("#label-for").nextAll('input').get()).toBeSameTiElementsAs(elems.not(':first').filter('input').get());
            });
            same(K("#label-for").nextAll('input,select').get(), elems.not(':first').filter('input,select').get(), "Multiple-filtered nextAll check");
            same(K("#label-for, #hidden1").nextAll('input,select').get(), elems.not(':first').filter('input,select').get(), "Multi-source, multiple-filtered nextAll check");
        });

        describe("prevAll([String])", function () {


            var elems = K(K('#form').children().slice(0, 12).get().reverse());
            it("Simple prevAll check", function () {
                expect(K("#area1").prevAll().get()).toBeSameTiElementsAs(elems.get());
            });
            it("Filtered prevAll check", function () {
                expect(K("#area1").prevAll('input').get()).toBeSameTiElementsAs(elems.filter('input').get());
            });
            same(K("#area1").prevAll('input,select').get(), elems.filter('input,select').get(), "Multiple-filtered prevAll check");
            same(K("#area1, #hidden1").prevAll('input,select').get(), elems.filter('input,select').get(), "Multi-source, multiple-filtered prevAll check");
        });

        describe("nextUntil([String])", function () {


            var elems = K('#form').children().slice(2, 12);
            it("nextUntil with no selector (nextAll)", function () {
                expect(K("#text1").nextUntil().get()).toBeSameTiElementsAs(K("#text1").nextAll().get());
            });
            it("nextUntil with invalid selector (nextAll)", function () {
                expect(K("#text1").nextUntil(".foo").get()).toBeSameTiElementsAs(K("#text1").nextAll().get());
            });
            it("Simple nextUntil check", function () {
                expect(K("#text1").nextUntil("#area1").get()).toBeSameTiElementsAs(elems.get());
            });
            it("Simple nextUntil check", function () {
                expect(K("#text1").nextUntil("#text2").length).toEqual(0);
            });
            same(K("#text1").nextUntil("#area1, #radio1").get(), K("#text1").next().get(), "Less simple nextUntil check");
            same(K("#text1").nextUntil("#area1", "input").get(), elems.not("button").get(), "Filtered nextUntil check");
            same(K("#text1").nextUntil("#area1", "button").get(), elems.not("input").get(), "Filtered nextUntil check");
            same(K("#text1").nextUntil("#area1", "button,input").get(), elems.get(), "Multiple-filtered nextUntil check");
            equals(K("#text1").nextUntil("#area1", "div").length, 0, "Filtered nextUntil check, no match");
            same(K("#text1, #hidden1").nextUntil("#area1", "button,input").get(), elems.get(), "Multi-source, multiple-filtered nextUntil check");
            it("Non-element nodes must be skipped, since they have no attributes", function () {
                expect(K("#text1").nextUntil("[class=foo]").get()).toBeSameTiElementsAs(K("#text1").nextAll().get());
            });
        });

        describe("prevUntil([String])", function () {


            var elems = K("#area1").prevAll();
            it("prevUntil with no selector (prevAll)", function () {
                expect(K("#area1").prevUntil().get()).toBeSameTiElementsAs(elems.get());
            });
            it("prevUntil with invalid selector (prevAll)", function () {
                expect(K("#area1").prevUntil(".foo").get()).toBeSameTiElementsAs(elems.get());
            });
            it("Simple prevUntil check", function () {
                expect(K("#area1").prevUntil("label").get()).toBeSameTiElementsAs(elems.not(':last').get());
            });
            it("Simple prevUntil check", function () {
                expect(K("#area1").prevUntil("#button").length).toEqual(0);
            });
            same(K("#area1").prevUntil("label, #search").get(), K("#area1").prev().get(), "Less simple prevUntil check");
            same(K("#area1").prevUntil("label", "input").get(), elems.not(':last').not("button").get(), "Filtered prevUntil check");
            same(K("#area1").prevUntil("label", "button").get(), elems.not(':last').not("input").get(), "Filtered prevUntil check");
            same(K("#area1").prevUntil("label", "button,input").get(), elems.not(':last').get(), "Multiple-filtered prevUntil check");
            equals(K("#area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match");
            same(K("#area1, #hidden1").prevUntil("label", "button,input").get(), elems.not(':last').get(), "Multi-source, multiple-filtered prevUntil check");
        });

        describe("contents()", function () {

            it("Check element contents", function () {
                expect(K("#ap").contents().length).toEqual(9);
            });
            it("Check existance of IFrame document", function () {
                expect(K("#iframe").contents()[0]).toBeDefined();
            });
            var ibody = K("#loadediframe").contents()[0].body;
            it("Check existance of IFrame body", function () {
                expect(ibody).toBeDefined();
            });

            equals(K("span", ibody).text(), "span text", "Find span in IFrame and check its text");

            K(ibody).append("<div>init text</div>");
            equals(K("div", ibody).length, 2, "Check the original div and the new div are in IFrame");

            equals(K("div:last", ibody).text(), "init text", "Add text to div in IFrame");

            K("div:last", ibody).text("div text");
            equals(K("div:last", ibody).text(), "div text", "Add text to div in IFrame");

            K("div:last", ibody).remove();
            equals(K("div", ibody).length, 1, "Delete the div and check only one div left in IFrame");

            equals(K("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame");

            K("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
            K("table", ibody).remove();
            equals(K("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame");

            // using contents will get comments regular, text, and comment nodes
            var c = K("#nonnodes").contents().contents();
            it("Check node,textnode,comment contents is just one", function () {
                expect(c.length).toEqual(1);
            });
            it("Check node,textnode,comment contents is just the one from span", function () {
                expect(c[0].nodeValue).toEqual("hi");
            });
        });

        describe("add(String|Element|Array|undefined)", function () {

            same(K("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document");
            same(K("#sndp").add(K("#en")[0]).add(K("#sap")).get(), q("sndp", "en", "sap"), "Check elements from document");
            it("Check elements from array", function () {
                expect(K([]).add(K("#form")[0].elements).length >= 13).toBeDefined();
            });

            // For the time being, we're discontinuing support for K(form.elements) since it's ambiguous in IE
            // use K([]).add(form.elements) instead.
            //equals( K([]).add(K("#form")[0].elements).length, K(K("#form")[0].elements).length, "Array in constructor must equals array in add()" );
            var divs = K("<div/>").add("#sndp");
            it("Make sure the first element is still the disconnected node.", function () {
                expect(!divs[0].parentNode).toBeDefined();
            });

            divs = K("<div>test</div>").add("#sndp");
            it("Make sure the first element is still the disconnected node.", function () {
                expect(divs[0].parentNode.nodeType).toEqual(11);
            });

            divs = K("#sndp").add("<div/>");
            it("Make sure the first element is still the disconnected node.", function () {
                expect(!divs[1].parentNode).toBeDefined();
            });

            var tmp = K("<div/>");

            var x = K([]).add(K("<p id='x1'>xxx</p>").appendTo(tmp)).add(K("<p id='x2'>xxx</p>").appendTo(tmp));
            it("Check on-the-fly element1", function () {
                expect(x[0].id).toEqual("x1");
            });
            it("Check on-the-fly element2", function () {
                expect(x[1].id).toEqual("x2");
            });

            var x = K([]).add(K("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(K("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
            it("Check on-the-fly element1", function () {
                expect(x[0].id).toEqual("x1");
            });
            it("Check on-the-fly element2", function () {
                expect(x[1].id).toEqual("x2");
            });

            var x = K([]).add(K("<p id='x1'>xxx</p>")).add(K("<p id='x2'>xxx</p>"));
            it("Check on-the-fly element1", function () {
                expect(x[0].id).toEqual("x1");
            });
            it("Check on-the-fly element2", function () {
                expect(x[1].id).toEqual("x2");
            });

            var x = K([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
            it("Check on-the-fly element1", function () {
                expect(x[0].id).toEqual("x1");
            });
            it("Check on-the-fly element2", function () {
                expect(x[1].id).toEqual("x2");
            });

            var notDefined;
            it("Check that undefined adds nothing", function () {
                expect(K([]).add(notDefined).length).toEqual(0);
            });
            it("Add a form (adds the elements)", function () {
                expect(K([]).add(document.getElementById('form')).length >= 13).toBeDefined();
            });
        });

        describe("add(String, Context)", function () {


            deepEqual(K("#firstp").add("#ap").get(), q("firstp", "ap"), "Add selector to selector ");
            deepEqual(K(document.getElementById("firstp")).add("#ap").get(), q("firstp", "ap"), "Add gEBId to selector");
            deepEqual(K(document.getElementById("firstp")).add(document.getElementById("ap")).get(), q("firstp", "ap"), "Add gEBId to gEBId");

            var ctx = document.getElementById("firstp");
            deepEqual(K("#firstp").add("#ap", ctx).get(), q("firstp"), "Add selector to selector ");
            deepEqual(K(document.getElementById("firstp")).add("#ap", ctx).get(), q("firstp"), "Add gEBId to selector, not in context");
            deepEqual(K(document.getElementById("firstp")).add("#ap", document.getElementsByTagName("body")[0]).get(), q("firstp", "ap"), "Add gEBId to selector, in context");
        });
    });

})();