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
		string = 'Wood: ' + PlayerVillage.resources.wood
		+ ' --- Food: ' + PlayerVillage.resources.food
		+ ' --- Stone: ' + PlayerVillage.resources.stone
		+ ' --- Population: ' + PlayerVillage.resources.population;
		
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
		return this;
	},
	
	deconstruct: function() {
		this.windowText.destroy();
		this.destroy();
	}
});

// a tooltip is a very tiny GUI_Window that is usually spawned by mouseovers.
Crafty.c('Tooltip', {
	init: function() {
		this.requires('2D, Mouse')
			.attr( { x: Crafty.mousePos.x, y: Crafty.mousePos.y, w: 0, h: 0 } );
		
		this.tooltipText = Crafty.e('2D, DOM, Text')
			.attr( { x: this.x + 8, y: this.y - 16 } )
			.css($tooltip_css);
		
		this.setText(' ');
		
		this.bindToMouse();
	},
	
	attachToMouse: function(frameNumber) {
		this.attr( { x: Crafty.mousePos.x, y: Crafty.mousePos.y } );
		this.tooltipText.attr( { x: this.x + 8, y: this.y - 16 });
	},
	
	bindToMouse: function() {
		this.bind('EnterFrame', this.attachToMouse);
	},
	
	unbindToMouse: function() {
		this.unbind('EnterFrame', this.attachToMouse);
	},
	
	show: function() {
		this.tooltipText.visible = true;
		this.bindToMouse();
		return this;
	},
	
	hide: function() {
		this.tooltipText.visible = false;
		this.unbindToMouse();
		return this;
	},
	
	setText: function(textIn) {
		this.tooltipText.text(textIn);
		return this;
	},
	
	deconstruct: function() {
		this.tooltipText.destroy();
		this.destroy();
	}
});

// floating informational text.
Crafty.c('FloatingInfoText', {
	init: function() {
		this.requires('2D, DOM, Text, Tween');
	},
	
	FloatingInfoText: function(xIn, yIn, textIn, hang) {
		this.attr( {
			x: xIn,
			y: yIn })
		  .css($tooltip_css)
		  .text(textIn);
		
		var hangTime = 0;
		
		if (typeof hang === 'undefined') {
			hangTime = 600;
		} else {
			hangTime = hang;
		}
		
		this.tweenSpeed = 120;
		
		this.timeout(this.tweenAway, hangTime);
		
		this.bind('TweenEnd', this.destroy);
		
		return this;
	},
	
	tweenAway: function() {
		this.tween( {
		alpha: 0.0,
		x: this._x,
		y: this._y - 256, }, this.tweenSpeed);
	}
});

// game log text. Hangs around in the lower right for two seconds, then tweens away.
Crafty.c('GameLogText', {
	init: function() {
		this.requires('2D, DOM, Text, Tween');
	},
	
	GameLogText: function(textIn) {
		this.attr( {
			x: (Game.viewportWidth()/3) * 2,
			y: (Game.viewportHeight() - 32) })
		  .css($tooltip_css)
		  .text(textIn);
		
		this.tweenSpeed = 120;
		
		this.timeout(this.tweenAway, 2000);
		
		this.bind('TweenEnd', this.destroy);
		
		return this;
	},
	
	tweenAway: function() {
		this.tween( {
		alpha: 0.0,
		x: this._x,
		y: this._y - 256, }, this.tweenSpeed);
	}
});

// this component is a drop-down menu for building something.
Crafty.c('BuildMenu', {
	init: function() {
		this.requires('2D, Mouse');
		
		this.menuOptions = []
		
		this.bind('TimeIsDay', this.deconstruct);
	},
	
	BuildMenu: function(tile) {
		this.placeAtX = tile.tile_x; this.placeAtY = tile.tile_y;
		
		this.attr({
			x: Crafty.mousePos.x,
			y: Crafty.mousePos.y,
			w: 128,
			h: 64,
			
			z: Game.gui_Z()
		});
		
		menuStrings = [ 'Granary', 'House' ];
		
		// BUILD REQUIREMENTS
		// using unshift instead of push here means that buildings which can't always be built will be
		// more prominent on the menu when they can.
		if (tile.has('StoneField')) {
			menuStrings.unshift('Mining Camp');
			debugMsg("Mining camp can be built here");
		} else if (tile.has('Grass')) {
			menuStrings.unshift('Farm');
		} else {
			debugMsg('something weird is happening in the build menu!');
		}
		
		// Now construct the actual menu
		this.menuOptions = [ ]
		debugMsg(menuStrings);
		for (var i = 0; i < menuStrings.length; i++) {
			this.menuOptions.push(Crafty.e('BuildMenuOption').BuildMenuOption(this, i, menuStrings[i]));
		}
		
		// now ensure that Close is at the very end
		this.menuOptions.push(Crafty.e('BuildMenuOption').BuildMenuOption(this, menuStrings.length, 'Close'));
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
			this.menuOptions[x].deconstruct();
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
		
		this.sprite(0, Buildings.getOptionSpriteNumber(this.name), 1, 1);
		
		this.tooltip = Crafty.e('Tooltip');
		
		if (this.name != 'Close') {
			debugMsg("Setting up menu option for " + this.name);
			cost = Buildings.lookupCost(this.name);
		
			textString = this.name + '; '
				+ '  Cost: '
				+ cost.wood + ' wood, '
				+ cost.food + ' food, '
				+ cost.stone + ' stone';
			
			textString = textString + '. ' + Buildings.lookupBenefitString(this.name).str;
		
			this.tooltip.setText(textString);
		} else {
			this.tooltip.setText('Close the menu.');
		}
		this.tooltip.hide();
		
		this.bind('MouseOver', function() {
			this.tooltip.show();
		});
		
		this.bind('MouseOut', function() {
			this.tooltip.hide();
		});
		
		this.bind('MouseUp', function(e) {
			this.parentMenu.select(this);
		});
		
		cost = Buildings.lookupCost(this.name);
		
		return this;
	},
	
	deconstruct: function() {
		this.tooltip.deconstruct();
		this.destroy();
	}
});

// screen-scroller!
Crafty.c('ScreenScroll', {
	init: function() {
		this.requires('Keyboard');
		
		this.bind('EnterFrame', function() {
			if (this.isDown('W')) {
				Crafty.viewport.scroll('_y', Crafty.viewport.y + 4);
				Crafty.trigger('ViewportMovement',
					{ x: Crafty.viewport.x, y: Crafty.viewport.y });
			} else if (this.isDown('S')) {
				Crafty.viewport.scroll('_y', Crafty.viewport.y - 4);
				Crafty.trigger('ViewportMovement',
					{ x: Crafty.viewport.x, y: Crafty.viewport.y });
			} else if (this.isDown('A')) {
				Crafty.viewport.scroll('_x', Crafty.viewport.x + 4);
				Crafty.trigger('ViewportMovement',
					{ x: Crafty.viewport.x, y: Crafty.viewport.y });
			} else if (this.isDown('D')) {
				Crafty.viewport.scroll('_x', Crafty.viewport.x - 4);
				Crafty.trigger('ViewportMovement',
					{ x: Crafty.viewport.x, y: Crafty.viewport.y });
			}
		});
	}
});