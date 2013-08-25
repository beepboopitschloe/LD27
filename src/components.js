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

// this coloured rectangle is used for the day/night cycle.
Crafty.c('Sky', {
	init: function() {
		this.requires('2D, Canvas, Color, Tween, Delay, Keyboard')
			.attr( {
				x: 0,
				y: 0,
				w: Game.width(),
				h: Game.height(),
				z: Game.sky_Z(),
				alpha: 0.5
				})
			.color('rgb(0,0,255)');
		
		this.state = 'night';
		
		this.control = function(frameNumber) {
			// DEBUG: initiate day/night cycle
			if (this.isDown('SPACE')) {
				this.start();
			}
			
			// DEBUG: make day or night. T for toggle.
			else if (this.isDown('T')) {
				this.cycle()
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
	},
	
	// this terribly-named function sets the z coordinate according to the building's y coordinate.
	setZusingY: function() {
		this.attr( { z: Math.floor(this.y/16) } );
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
					// open the build menu
					Crafty.e('BuildMenu').BuildMenu(this.tile_x, this.tile_y);
				}
			}
		});
	}
});

// generic component for harvestable resources
Crafty.c('NaturalResource', {
	init: function() {
		this.requires("2D, Canvas, NocturnalTile, Mouse");
		
		this.markedForHarvesting = false;
		
		this.bind('MouseOver', function() {
			this.sprite(0, 1, 1, 1);
		});
		
		this.bind('MouseOut', function() {
			this.sprite(0, 0, 1, 1);
		});
		
		this.bind('MouseUp', function(e) {
			if (this.mouseControlOn) {
				this.sprite(0, 1, 1, 1);
				this.unbind('MouseOut');
				this.unbind('MouseOver');
				
				this.markedForHarvesting = true;
				PlayerVillage.taskHandler.add(this);
			}
		});
			
		this.bind('TimeIsDay', function() {
			if (this.markedForHarvesting) {
				//this.timeout(this.harvest, 1000);
			}
		});
	}
});

// tree tile
Crafty.c('Tree', {
	init: function() {
		this.requires('NaturalResource, spr_tree');
		
		this.areaMap(
			[0, 47],
			[29, 24],
			[34, 24],
			[64, 47],
			[32, 64]
			);
	},
	
	harvest: function() {
		PlayerVillage.updateResources('wood', 10);
		replaceTile(this, Crafty.e('Grass'), World.map);
	}
});

// stone tile
Crafty.c('Stone', {
	init: function() {
		this.requires('NaturalResource, spr_stone');
		
		this.areaMap(
			[0,48],
			[32,32],
			[64,48],
			[32,64]
			);
		
	},

	harvest: function() {
		PlayerVillage.updateResources('stone', 4);
		replaceTile(this, Crafty.e('Grass'), World.map);
	}
});

// this is a building plot. It can be placed at night, and will be built during the day.
Crafty.c('BuildingPlot', {
	init: function() {
		this.requires('2D, Canvas, NocturnalTile, Mouse, spr_building_plot');
		
		this.tooltip = null;
		this.type = null;
		
		this.areaMap(
				[17, 49],
				[17, 25],
				[32, 17],
				[48, 25],
				[48, 49],
				[32, 57]
			);
		
		// tell the plot to become a building during the day
		this.bind('TimeIsDay', function() { PlayerVillage.taskHandler.add(this); } );
		
		this.bind('MouseOver', function() {
			this.spawnInfoWindow();
		});
		
		this.bind('MouseOut', function() {
			this.destroyInfoWindow();
		});
		
		this.bind('MouseUp', function(e) {
			if (e.mouseButton == Crafty.mouseButtons.LEFT) {
				coords = World.map.px2pos(Crafty.mousePos.x, Crafty.mousePos.y);
				
				console.log('coords: ' + coords.x + ', ' + coords.y);
			}
		});
	},
	
	// this constructor takes the name of the component this plot should turn into.
	BuildingPlot: function(building) {
		this.type = building;
		
		return this;
	},
	
	build: function() {
		cost = Buildings.lookupCost(this.type);
		if (PlayerVillage.resources.wood >= cost.wood
			&& PlayerVillage.resources.food >= cost.food
			&& PlayerVillage.resources.stone >= cost.stone) {
			tile = Crafty.e(this.type);
			replaceTile(this, tile, World.map);
			PlayerVillage.updateResources('wood', -cost.wood);
			PlayerVillage.updateResources('food', -cost.food);
			PlayerVillage.updateResources('stone', -cost.stone);
			return 'success';
		} else {
			return 'fail';
		}
	},
	
	spawnInfoWindow: function() {
		this.tooltip = Crafty.e('Tooltip');
	},
	
	destroyInfoWindow: function() {
		this.tooltip.deconstruct();
		this.tooltip = null;
	}
});

// farm building
Crafty.c('Farm', {
	init: function() {
		this.requires('Building, ResourceProducer, spr_farm');
		
		this.maxDaysUntilYield(3);
		this.daysUntilYield(3);
		this.yield(5);
		
		this.tooltipText = 'Farm: produces 5 food every 3 days';
		
		this.areaMap(
				[0, 48],
				[32, 32],
				[64, 48],
				[32, 64]
			);
	}
});

// house building
Crafty.c('House', {
	init: function() {
		this.requires('Building, spr_house');
		
		this.areaMap(
				[0, 48],
				[32, 32],
				[64, 48],
				[32, 64]
			);
		
		PlayerVillage.updateResources('population', 2);
		this.tooltipText = 'House: adds to your population by 2';
	}
});

// basic building component
Crafty.c('Building', {
	init: function() {
		this.requires('2D, Canvas, NocturnalTile, Mouse');
		
		this.tooltip = null;
		this.tooltipText = ' ';
		
		this.bind('MouseOver', function() {
			this.spawnInfoWindow();
		});
		
		this.bind('MouseOut', function() {
			this.destroyInfoWindow();
		});
		
		this.bind('MouseUp', function(e) {
			if (e.mouseButton == Crafty.mouseButtons.LEFT) {
				coords = World.map.px2pos(Crafty.mousePos.x, Crafty.mousePos.y);
				
				console.log('coords: ' + coords.x + ', ' + coords.y);
			}
		});
	},
	
	spawnInfoWindow: function() {
		this.tooltip = Crafty.e('Tooltip').setText(this.tooltipText);
	},
	
	destroyInfoWindow: function() {
		if (this.tooltip != null) {
			this.tooltip.deconstruct();
			this.tooltip = null;
		}
	}
});

// resource-producer component
Crafty.c('ResourceProducer', {
	init: function() {
		this._maxDaysUntilYield = 1;
		this._daysUntilYield = 1;
		this._type = 'food';
		this._yield = 1;
		
		this.bind('TimeIsDay', this.dailyUpdate);
	},
	
	maxDaysUntilYield: function(num) {
		if (typeof num !== 'undefined') {
			this._maxDaysUntilYield = num;
		} else {
			return this._maxDaysUntilYield;
		}
	},
	
	daysUntilYield: function(num) {
		if (typeof num !== 'undefined') {
			this._daysUntilYield = num;
		} else {
			return this._daysUntilYield;
		}
	},
	
	resourceType: function(str) {
		console.log('changing type to ' + str);
		if (typeof str !== 'undefined') {
			this._type = str;
		} else {
			return this._type;
		}
	},
	
	yield: function(num) {
		if(typeof num !== 'undefined') {
			this._yield = num;
		} else {
			return this._yield;
		}
	},
	
	dailyUpdate: function() {
		console.log(this._daysUntilYield + " days until yield");
		if (this._daysUntilYield > 0) {
			this._daysUntilYield -= 1;
			return;
		} else {
			this.yieldResources();
			this._daysUntilYield = this._maxDaysUntilYield;
		}
	},
	
	yieldResources: function() {
		console.log('Yielded ' + this._yield + " " + this._type);
		PlayerVillage.updateResources(this._type, this._yield);
	}
});

// test building
Crafty.c('TestBuilding', {
	init: function() {
		this.requires('Building, spr_building');
		
		this.areaMap(
				[17, 49],
				[17, 25],
				[32, 17],
				[48, 25],
				[48, 49],
				[32, 57]
			);
		
		this.tooltipText = 'Test Building';
	}
});