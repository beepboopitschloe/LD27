/*
	components.js
	Herein lie the components to be used in the game.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

// walking character
Crafty.c('Actor', {
	init: function() {
		this.requires("2D, Canvas, Color, Fourway")
			.attr( { w: 8, h: 8 } )
			.color('rgb(255, 150, 25)')
			.fourway(4);
		
		this.walks = false;
		this.disableControl();
		
		this.bind('TimeIsNight', function() {
			this.walks = true;
			this.enableControl();
		});
		
		this.bind('TimeIsDay', function() {
			this.walks = false;
			this.disableControl();
		});
	},
	
	visitBuilding: function(data) {
		building = data[0].obj;
		building.spawnInfoWindow();
	}
});

// this component handles mouse input.
Crafty.c('MouseController', {
	init: function() {
		this.requires('2D, Mouse');
		
		this.attr({
			x: 0,
			y: 0,
			w: Game.width(),
			h: Game.width()
		});
		
		console.log('setting up mouse control');
		
		this.bind('MouseUp', function(e) {
			console.log('MOUSE EVENT');
			console.log(Crafty.mousePos.x + " " + Crafty.mousePos.y);
			
			isoCoords = Game.map.px2pos(Crafty.mousePos.x, Crafty.mousePos.y);
			
			console.log(isoCoords.x + ', ' + isoCoords.y);
			
			//if (e.mouseButton == Crafty.mouseButtons.RIGHT) {
			//	Game.map.place(isoCoords.x, isoCoords.y, 1, Crafty.e('Building'));
			//}
		});
	}
});

// this coloured rectangle is used for the day/night cycle.
Crafty.c('Sky', {
	init: function() {
		this.requires('2D, Canvas, Color, Tween, Delay, Keyboard')
			.attr( {
				x: 0,
				y: 0,
				w: Game.width(),
				h: Game.height(),
				alpha: 0.5
				})
			.color('rgb(0,0,255)');
		
		this.state = 'night';
		
		this.control = function(frameNumber) {
			if (this.isDown('SPACE')) {
				this.start();
			}
		}
		
		this.bind('EnterFrame', this.control);
		
		this.redraw = function() {
			this.tween( { alpha: 0.5 }, 1);
		}
		
		this.bind('ItemPlaced', this.redraw);
		/* REMOVED FOR FPS REASONS. Apparently having a big 2048 x 2048 rectangle is better.
		this.bind('EnterFrame', function(frameNumber) {
			if (this.x != Crafty.viewport.x) {
				this.attr( { x: -Crafty.viewport.x } );
			}
			if (this.y != Crafty.viewport.y) {
				this.attr( { y: -Crafty.viewport.y } );
			}
			console.log(Crafty.viewport.x + " " + Crafty.viewport.y);
		}); */
	},
	
	// this function begins the SkyTint's constant day/night cycling behaviour.
	start: function() {
		// the delay will run the day/night cycle indefinitely. Every 10000 milliseconds (10 seconds)
		// the rect will change from light to dark or dark to light.
		console.log('starting day/night cycle');
		
		this.unbind('EnterFrame', this.control);
		
		Crafty.trigger('TimeIsDay');
		this.state = 'day';
		this.tween( {alpha: 0.0}, 1);
		this.delay(this.cycle, 5000, -1);
	},
	
	cycle: function() {
		// if day, cycle to night
		if (this.state == 'day') {
			this.state = 'night';
			//DEBUG: console.log('changing to night');
			this.tween( {alpha: 0.5}, 60 );
			Crafty.trigger('TimeIsNight');
		}
		// if night, cycle to day
		else if (this.state == 'night') {
			this.state = 'day';
			//DEBUG: console.log('changing to day');
			this.tween( {alpha: 0.0}, 60 );
			Crafty.trigger('TimeIsDay');
		}
	}
});

// tile logic component
Crafty.c('TileLogic', {
	init: function() {
		this.mouseControlOn = true;
	},
	
	// enable/disable mouse controls
	enableMouseControl: function() {
		this.mouseControlOn = true;
	},
	
	disableMouseControl: function() {
		this.mouseControlOn = false;
	},
	
	// tileSetup: takes in coordinates of the form [x, y] and uses them for tile logics.
	tileSetup: function(coords) {
		this.tile_x = coords[0];
		this.tile_y = coords[1];
	}
});

// for tiles that can only be controlled at night
Crafty.c('NocturnalTile', {
	init: function() {
		this.requires('TileLogic');
		
		this.bind('TimeIsNight', function() {
			this.enableMouseControl();
		});
		
		this.bind('TimeIsDay', function() {
			this.disableMouseControl();
		});
	}
});

// grass tile
Crafty.c('Grass', {
	init: function() {
		this.requires("2D, Canvas, NocturnalTile, Mouse, spr_grass");
		
		this.areaMap(
			[0,48],
			[32,32],
			[64,48],
			[32,64]
			);
		
		this.bind('MouseOver', function() {
			this.sprite(0, 1, 1, 1);
		});
		
		this.bind('MouseOut', function() {
			this.sprite(0, 0, 1, 1);
		});
		
		this.bind('MouseUp', function(e) {
			if (this.mouseControlOn) {
				if (e.mouseButton == Crafty.mouseButtons.RIGHT) {
					// place a building
					tile = Crafty.e('Building');
					Game.map.place(this.tile_x, this.tile_y, 0, tile);
					Crafty.trigger('ItemPlaced');
					tile.tileSetup([this.tile_x, this.tile_y]);
					
					// redraw around the building
					Game.map_tiles[tile_x][tile_y+1].draw(this.x, this.y, this.x, this.y - 128);
					
					// destroy the grass tile
					this.destroy();
				}
			}
			if (e.mouseButton == Crafty.mouseButtons.LEFT) {
				coords = Game.map.px2pos(Crafty.mousePos.x, Crafty.mousePos.y);
				
				console.log('coords: ' + coords.x + ', ' + coords.y);
			}
		});
	}
});

// test building
Crafty.c('Building', {
	init: function() {
		this.requires('2D, Canvas, NocturnalTile, Mouse, spr_building');
		
		this.tooltip = null;
		
		// this is an in-progress attempt to fix the bounding box issue.
		this.areaMap(
				[17, 49],
				[17, 25],
				[32, 17],
				[48, 25],
				[48, 49],
				[32, 57]
			);
		
		this.bind('MouseOver', function() {
			this.spawnInfoWindow();
		});
		
		this.bind('MouseOut', function() {
			this.destroyInfoWindow();
		});
		
		this.bind('MouseUp', function(e) {
			if (e.mouseButton == Crafty.mouseButtons.LEFT) {
				coords = Game.map.px2pos(Crafty.mousePos.x, Crafty.mousePos.y);
				
				console.log('coords: ' + coords.x + ', ' + coords.y);
			}
		});
	},
	
	spawnInfoWindow: function() {
		this.tooltip = Crafty.e('Tooltip');
	},
	
	destroyInfoWindow: function() {
		this.tooltip.deconstruct();
		this.tooltip = null;
	}
});