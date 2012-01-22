var K = require('kranium/init').K;
(function() {
  exports.Class = K.UI.View.extend({
    layout: "vertical",
    cubeRow: function(num) {
      return {
        title: "" + (num * num) + " is the cube of " + num,
        className: "cubeRow"
      };
    },
    init: function() {
      var list, me, num;
      me = this;
      list = [1, 2, 3];
      this.children = [
        {
          className: "demoitem",
          type: "label",
          text: this.text + " comes around!"
        }, {
          className: "demoitem swipeme",
          type: "label",
          text: "swipe me",
          events: {
            swipe: function(e) {
              return alert(e);
            },
            app: {
              pause: function(e) {
                return this.text = "Don't you dare pausing me!";
              }
            }
          }
        }, {
          className: "demoitem clickme",
          type: "button",
          title: "click me",
          click: function(e) {
            return alert(e);
          }
        }, {
          className: "demoitem coffeetable",
          type: "tableview",
          data: [
            {
              title: new Date().getDay() === 5 ? "Happy Friday!" : "Dullday"
            }, {
              title: typeof nope !== "undefined" && nope !== null ? "w00t" : "Not defined"
            }, {
              className: "leftRightRow",
              children: [
                {
                  className: "lefty",
                  type: "label",
                  text: "lefty"
                }, {
                  className: "righty",
                  type: "label",
                  text: "righty"
                }
              ]
            }
          ].concat((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = list.length; _i < _len; _i++) {
              num = list[_i];
              _results.push(me.cubeRow(num));
            }
            return _results;
          })())
        }
      ];
      return this._super.apply(this, arguments);
    }
  });
}).call(this);
