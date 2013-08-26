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
		this.requires('Mouse');
		
		this.tile_x = null;
		this.tile_y = null;
		this.neighbors = [];
		
		this.mouseControlOn = true;
		
		this.bind('MouseUp', function(e) {
			if (this.mouseControlOn) {
				Crafty.trigger('TileClicked', { tile: this, mouse: e });
			}
		});
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
		
		World.map_tiles[this.tile_x][this.tile_y] = this;
	},
	
	setupNeighbors: function() {
		// set up the list of tile neighbors
		/* LOOPING METHOD
		for (var x = this.tile_x - 1; x <= this.tile_x; x++) {
			for (var y = this.tile_y - 1; y <= this.tile_y + 2; y++) {
				// don't check tiles that shoudn't be neighbors
				if (y == this.tile_y) continue;
				if (x == this.tile_x - 1 && y == this.tile_y + 2) continue;
				if (x == this.tile_x - 1 && y == this.tile_y - 2) continue;
				
				console.log(this.tile_x + ', ' + this.tile_y + ' checking for neighbor at '
					+ x + ', ' + y);
				// don't put self in neighbors list, or check negative tiles
				if (x < 0 || y < 0
						|| x > World.map_width() || y > World.map_height()) {
					continue;
				} else {
					this.neighbors.push(World.map_tiles[x][y]);
					console.log('neighbor added to ' + this.tile_x + ', ' + this.tile_y);
				}
			}
		} */
		
		// SPECIAL CASE METHOD
		x = this.tile_x;
		y = this.tile_y;
		
		if (y % 2 == 1) {
			this.addToNeighbors(x-1, y);
			this.addToNeighbors(x, y-2);
			this.addToNeighbors(x, y-1);
			this.addToNeighbors(x, y+1);
			this.addToNeighbors(x, y+2);
			this.addToNeighbors(x+1, y-1);
			this.addToNeighbors(x+1, y);
			this.addToNeighbors(x+1, y+1);
		} else {
			this.addToNeighbors(x-1, y-1);
			this.addToNeighbors(x-1, y);
			this.addToNeighbors(x-1, y+1);
			this.addToNeighbors(x, y-2);
			this.addToNeighbors(x, y-1);
			this.addToNeighbors(x, y+1);
			this.addToNeighbors(x, y+2);
			this.addToNeighbors(x+1,y);
		}
		
		this.trigger('NeighborsUpdated');
	},
	
	addToNeighbors: function(x, y) {
		if (x >= 0 && y >= 0 && x < World.map_width() && y < World.map_height())
			this.neighbors.push(World.map_tiles[x][y]);
	},
	
	updateNeighbors: function() {
		this.neighbors = [];
		
		this.setupNeighbors();
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
		this.requires("2D, Canvas, NocturnalTile, spr_grass");
		
		this.areaMap(
			[0,48],
			[32,32],
			[64,48],
			[32,64]
			);
		
		this.bind('MouseOver', this.highlight);
		
		this.bind('MouseOut', this.dehighlight);
	},
	
	highlight: function() {
		this.sprite(0, 1, 1, 1);
	},
	
	dehighlight: function() {
		this.sprite(0, 0, 1, 1);
	},
	
	deconstruct: function() {
		this.destroy();
	}
});

// generic component for harvestable resources
Crafty.c('NaturalResource', {
	init: function() {
		this.requires("2D, Canvas, NocturnalTile");
		
		this.markedForHarvesting = false;
		this._type = 'food';
		this._amount = 1;
		
		this.bind('MouseOver', this.highlight);
		
		this.bind('MouseOut', this.dehighlight);
		
		this.bind('MouseUp', function(e) {
			if (this.mouseControlOn) {
				if (e.mouseButton == Crafty.mouseButtons.LEFT) {
					this.highlight();
					this.unbind('MouseOver', this.highlight);
					this.unbind('MouseOut', this.dehighlight);
				
					this.markedForHarvesting = true;
					PlayerVillage.taskHandler.add(this);
				} else if (e.mouseButton == Crafty.mouseButtons.RIGHT) {
					this.dehighlight();
					this.bind('MouseOver', this.highlight);
					this.bind('MouseOut', this.dehighlight);
					this.markedForHarvesting = false;
					PlayerVillage.taskHandler.remove(this);
				}
			}
		});
			
		this.bind('TimeIsDay', function() {
			if (this.markedForHarvesting) {
				//this.timeout(this.harvest, 1000);
			}
		});
	},
	
	highlight: function() {
		this.sprite(0, 1, 1, 1);
	},
	
	dehighlight: function() {
		this.sprite(0, 0, 1, 1);
	},
	
	setType: function(typeIn) {
		this._type = typeIn;
		return this;
	},
	
	setAmount: function(amountIn) {
		this._amount = amountIn;
		return this;
	},
	
	setTypeAndAmount: function(typeIn, amountIn) {
		this.setType(typeIn).setAmount(amountIn);
		return this;
	},
	
	harvest: function() {
		PlayerVillage.updateResources(this._type, this._amount);
		Crafty.e('FloatingInfoText').FloatingInfoText(this._x, this._y,
				this._amount + ' ' + this._type + ' harvested');
		replaceTile(this, Crafty.e('Grass'), World.map);
	},
	
	deconstruct: function() {
		this.tooltip.deconstruct();
		this.destroy();
	}
});

// tree tile
Crafty.c('Tree', {
	init: function() {
		this.requires('NaturalResource, HasTooltip, spr_tree');
		
		this.setTypeAndAmount('wood', 10);
		
		this.setTooltipText('Tree - harvest this for 10 wood');
		
		this.areaMap(
			[0, 47],
			[29, 24],
			[34, 24],
			[64, 47],
			[32, 64]
			);
	}
});

// stone tile
Crafty.c('Stone', {
	init: function() {
		this.requires('NaturalResource, HasTooltip, spr_stone');
		
		this.setTypeAndAmount('stone', 5);
		
		this.setTooltipText('Rock - harvest this for 5 stone');
		
		this.areaMap(
			[0,48],
			[32,32],
			[64,48],
			[32,64]
			);
	}
});

// a bush that can be harvested for food
Crafty.c('BerryBush', {
	init: function() {
		this.requires('NaturalResource, HasTooltip, spr_berry_bush');
		
		this.setTypeAndAmount('food', 3);
		
		this.setTooltipText('Berry Bush - harvest this for 3 food');
		
		this.areaMap(
			[0,48],
			[32,32],
			[64,48],
			[32,64]
			);
	}
});

// any entity with a tooltip
Crafty.c('HasTooltip', {
	init: function() {
		this.requires('Mouse');
		
		this.tooltip = Crafty.e('Tooltip').hide();
		
		this.bind('MouseOver', function() {
			this.tooltip.show();
		});
		
		this.bind('MouseOut', function() {
			this.tooltip.hide();
		});
	},
	
	setTooltipText: function(textIn) {
		this.tooltip.setText(textIn);
	}
});

// resource-producer component
Crafty.c('ResourceProducer', {
	init: function() {
		this._maxDaysUntilYield = 1;
		this._daysUntilYield = 1;
		this._type = 'food';
		this._full = false;
		this._producing = true;
		this._requiresHarvest = true;
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
	
	toggleProducing: function() {
		if (this._producing) {
			this._producing = false;
		} else {
			this._producing = true;
		}
		
		return this._producing;
	},
	
	requiresHarvest: function(boolIn) {
		this._requiresHarvest = boolIn;
	},
	
	dailyUpdate: function() {
		if (this._producing) {
			if (this._daysUntilYield > 0 && this._full == false) {
				this._daysUntilYield -= 1;
				return;
			} else {
				if (this._requiresHarvest) {
					if (this._full == false) {
						this._full = true;
						PlayerVillage.taskHandler.add(this);
					}
				} else {
					this.yieldResources();
				}
			}
		}
	},
	
	yieldResources: function() {
		PlayerVillage.updateResources(this._type, this._yield);
		this._full = false;
		this._daysUntilYield = this._maxDaysUntilYield;
		
		Crafty.e('FloatingInfoText').FloatingInfoText(this._x, this._y,
			'yielded ' + this._yield + ' ' + this._type);
		
		this.trigger('YieldedResources');
		
		return 'success';
	}
});

// a tile that requires information about other tiles to fulfill a condition.
Crafty.c('TileDependent', {
	init: function() {
		this.requires('TileLogic');
		
		this.tilesMeetingConditions = [];
		
		this._conditions = {
			cond: [],
			hasCondition: function(condition) {
				for (var i = 0; i < this.cond.length; i++) {
					if (this.cond[i] == condition)
						return true;
				}
				
				return false;
			},
			appendConditions: function(arrayIn) {
				for (var i = 0; i < arrayIn.length; i++) {
					if (this.cond.indexOf(arrayIn[i]) == -1) {
						this.cond.push(arrayIn[i]);
					}
				}
			},
			setConditions: function(arrayIn) {
				this.cond = arrayIn;
			},
			removeConditions: function(arrayIn) {
				for (var i = 0; i < arrayIn.length; i++) {
					index = this.cond.indexOf(arrayIn[i]);
					if (index != -1) {
						this.cond.splice(index-1, 1);
					}
				}
			}
		}
		
		this.bind('TimeIsDay', this.checkConditions)
		this.bind('NeighborsUpdated', this.checkConditions);
	},
	
	setConditions: function(arrayIn) {
		this._conditions.setConditions(arrayIn);
	},
	
	addConditions: function(arrayIn) {
		this._conditions.appendConditions(arrayIn);
	},
	
	removeConditions: function(arrayIn) {
		this._conditions.removeConditions(arrayIn);
	},
	
	checkConditions: function() {
		this.tilesMeetingConditions = [];
		
		for (var i = 0; i < this.neighbors.length; i++) {
			tile = this.neighbors[i];
			if (this._conditions.hasCondition('isFarm'))
				if (tile.has('Farm'))
					this.tilesMeetingConditions.push(tile);
			if (this._conditions.hasCondition('isStone'))
				if (tile.has('Stone'))
					this.tilesMeetingConditions.push(tile);
		}
		
		this.trigger('UpdatedConditions');
		return this.tilesMeetingConditions;
	}
});