exports.Class = View.extend
	layout: "vertical",
	cubeRow: (num) -> title: "#{ num*num } is the cube of #{ num }", className: "cubeRow" 
	init: ->
		me = @
		list = [1, 2, 3]
		
		@children = [{
			className: "demoitem"
			type: "label"
			text: @text + " comes around!"
		}
		{
			className: "demoitem swipeme"
			type: "label"
			text: "swipe me"
			events:
				swipe: (e) ->
					alert e
				app:
					pause: (e) ->
						@text = "Don't you dare pausing me!"
		}
		{
			className: "demoitem clickme"
			type: "button"
			title: "click me"
			click: (e) ->
				alert e
		}
		{
			className: "demoitem coffeetable"
			type: "tableview"
			data: [{
				title: if new Date().getDay() is 5 then "Happy Friday!" else "Dullday"
			},
			{
				title: if nope? then "w00t" else "Not defined"
			}
			{
				className: "leftRightRow"
				children: [{
					className: "lefty"
					type: "label"
					text: "lefty"
				}
				{
					className: "righty"
					type: "label"
					text: "righty"
				}]
			}].concat(me.cubeRow num for num in list)
		}]
		@_super.apply(@, arguments)