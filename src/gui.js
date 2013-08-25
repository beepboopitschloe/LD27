/*
	gui.js
	Herein lie the GUI components to be used in POTENTIAM LIMITATAM.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

// text which displays current FPS
Crafty.c('FPSText', {
	init: function() {
		this.requires('2D, DOM, Text, FPS')
			.attr({ x: 4, y: 32 })
			.css($tooltip_css)
			.text('FPS: ');
		
		// apparently there is a spelling error in CraftyJS.
		this.bind('MessureFPS', function(fps) {
			this.text('FPS: ' + fps.value);
		});
	}
});

// text which displays player resources
Crafty.c('PlayerInfoText', {
	init: function() {
		this.requires('2D, DOM, Text')
			.attr({ x: 4, y: Game.viewportHeight()-16 })
			.css($text_css)
			.text(' ');
		
		this.updateText();
		
		this.bind('PlayerResourcesUpdated', this.updateText);
	},
	
	updateText: function() {
		string = 'Wood: ' + PlayerVillage.resources.wood + ' --- Food: ' + PlayerVillage.resources.food;
		
		this.text(string);
	}
});

// a basic GUI window
Crafty.c('GUI_Window', {
	init: function() {
		this.requires('2D, Canvas, Color, Keyboard')
			.attr( {x: 128, y: 128, w: 640, h: 480 } )
			.color('rgb(50,50,200)');
		
		this.windowText = Crafty.e('2D, DOM, Text')
			.attr( { x: this.x+16, y: this.y+16 } )
			.text("TEST TEXT GOES ON FOR DAYS")
			.css($tooltip_css);
		
		this.bind('EnterFrame', function(frameNumber) {
			if (this.isDown('SPACE')) {
				this.deconstruct();
			}
		})
	},
	
	setText: function(textIn) {
		this.windowText.text(textIn);
	},
	
	deconstruct: function() {
		this.windowText.destroy();
		this.destroy();
	}
});

// a tooltip is a very tiny GUI_Window that is usually spawned by mouseovers.
Crafty.c('Tooltip', {
	init: function() {
		this.requires('GUI_Window')
			.attr( { x: Crafty.mousePos.x, y: Crafty.mousePos.y, w: 0, h: 0 } );
		
		this.setText('Test Tooltip');
		this.windowText.attr( { x: this.x+4, y: this.y+4 } );
		
		this.bind('EnterFrame', function(frameNumber) {
			this.attr( { x: Crafty.mousePos.x, y: Crafty.mousePos.y } );
			this.windowText.attr( { x: this.x+4, y: this.y+4 });
		});
	}
});

// this component is a drop-down menu for building something.
Crafty.c('BuildMenu', {
	init: function() {
		this.requires('2D, Mouse');
		
		this.menuOptions = []
	},
	
	BuildMenu: function(x, y) {
		this.placeAtX = x; this.placeAtY = y;
		
		this.attr({
			x: Crafty.mousePos.x,
			y: Crafty.mousePos.y,
			w: 128,
			h: 64,
			
			z: Game.gui_Z()
		});
		
		console.log(Game.sky_Z() + " " + Game.gui_Z());
		
		this.menuOptions = [
				Crafty.e('BuildMenuOption').BuildMenuOption(this, 0, 'TestBuilding'),
				Crafty.e('BuildMenuOption').BuildMenuOption(this, 1, 'Farm'),
				Crafty.e('BuildMenuOption').BuildMenuOption(this, 2, 'Close')
				]
	},
	
	select: function(option) {
		if (option.name == 'Close') {
			this.deconstruct();
			return;
		}
	
		building = Crafty.e('BuildingPlot').BuildingPlot(option.name);
		
		World.map.place(this.placeAtX, this.placeAtY, 0, building);
		building.tileSetup([this.placeAtX, this.placeAtY]);
		building.setZusingY();
		
		this.deconstruct();
	},
	
	deconstruct: function() {
		for (var x = 0; x < this.menuOptions.length; x++) {
			this.menuOptions[x].destroy();
		}
		
		this.destroy();
	}
});

// this is an option for use with the build menu.
Crafty.c('BuildMenuOption', {
	init: function() {
		this.requires('2D, Canvas, opt_build_menu, Mouse');
	},
	
	BuildMenuOption: function(parentMenu, optionNumber, name) {
		this.attr( {
			x: parentMenu.x + 4,
			y: parentMenu.y + 4 + (optionNumber*16),
			z: parentMenu.z + 1,
			name: name,
			parentMenu: parentMenu } );
		
		this.sprite(0, Buildings.buildMenuList.indexOf(this.name), 1, 1);
		
		this.bind('MouseUp', function(e) {
			this.parentMenu.select(this);
		});
		
		return this;
	}
});