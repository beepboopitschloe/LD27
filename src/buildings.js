/*
	buildings.js
	Herein lie the building components to be used in the game.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

// basic building component
Crafty.c('Building', {
	init: function() {
		this.requires('2D, Canvas, NocturnalTile, HasTooltip, Mouse');
		
		this.bind('MouseUp', function(e) {
			if (e.mouseButton == Crafty.mouseButtons.LEFT) {
				coords = World.map.px2pos(Crafty.mousePos.x, Crafty.mousePos.y);
				
				console.log('coords: ' + coords.x + ', ' + coords.y);
			}
		});
	}
});

// this is a building plot. It can be placed at night, and will be built during the day.
Crafty.c('BuildingPlot', {
	init: function() {
		this.requires('2D, Canvas, NocturnalTile, HasTooltip, Mouse, spr_building_plot');
		
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
		
		this.bind('MouseUp', function(e) {
			if (e.mouseButton == Crafty.mouseButtons.RIGHT) {
				this.deconstruct();
			}
		});
	},
	
	// this constructor takes the name of the component this plot should turn into.
	BuildingPlot: function(building) {
		this.type = building;
		
		this.tooltip.setText('A ' + building + ' will be built here soon.');
		
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
	
	deconstruct: function() {
		this.tooltip.deconstruct();
		this.destroy();
	}
});

// farm building
Crafty.c('Farm', {
	init: function() {
		this.requires('Building, ResourceProducer, spr_farm');
		
		this.maxDaysUntilYield(3);
		this.daysUntilYield(3);
		this.yield(5);
		
		this.tooltip.setText('Farm: produces 5 food every 3 days');
		
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
		this.tooltip.setText('House: adds to your population by 2');
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
		
		this.tooltip.setText('Test Building');
	}
});
