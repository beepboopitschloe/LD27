/*
	handlers.js
	These components and objects are used to handle the player village
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

// CONTROL HANDLERS
Crafty.c('MouseHandler', {
	init: function() {
		this.bind('TileClicked', this.handleClick);
	},
	
	handleClick: function(data) {
		tile = data.tile;
		e = data.mouse;
		
		if (tile.has('Terrain')) {
			Crafty.e('BuildMenu').BuildMenu(tile);
		}
		
		if (tile.has('ResourceProducer')) {
			if (tile.toggleProducing() == true)
				Crafty.e('FloatingInfoText').FloatingInfoText(tile.x, tile.y, 'toggled production on', 0);
			else
				Crafty.e('FloatingInfoText').FloatingInfoText(tile.x, tile.y, 'toggled production off', 0)
		}
		
		if (tile.has('TileLogic')) {
			console.log('Clicked on ' + tile.tile_x + ', ' + tile.tile_y);
			console.log('Farm? ' + tile.has('Farm'));
		}
	}
});

// VILLAGE HANDLERS

// This schedules and performs tasks
Crafty.c('TaskHandler', {
	init: function() {
		console.log('task handler init');
		this.bind('TimeIsDay', function() {
			this.timeout(this.performTasks, 1000);
		});
	},
	
	add: function(task) {
		PlayerVillage.tasks.push(task);
	},
	
	remove: function(task) {
		index = PlayerVillage.tasks.indexOf(task);
		
		PlayerVillage.tasks.splice(index, 1);
	},
	
	performTasks: function() {
		unfinishedTasks = [];
		
		for (var i = 0; i < PlayerVillage.resources.population; i++) {
			task = PlayerVillage.tasks.pop();
			if (task == 'undefined') {
				continue;
			}
			
			if (task.has('NaturalResource')) {
				task.harvest();
			} else if (task.has('BuildingPlot')) {
				if (task.build() == 'fail') {
					unfinishedTasks.push(task);
					i -= 1;
				}
			} else if (task.has('ResourceProducer')) {
				if (task.yieldResources() == 'fail') {
					unfinishedTasks.push(task);
					i -= 1;
				}
			} else {
				continue;
			}
		}
		
		for (var i = 0; i < unfinishedTasks.length; i++) {
			this.add(unfinishedTasks.pop());
		}
	}
});

// This handles the eating of food, and winning when you hit 100 population
Crafty.c('PopHandler', {
	init: function() {
		console.log('population handler init');
		this.bind('TimeIsDay', function() {
			this.timeout(this.handlePop, 1500);
		});
	},
	
	handlePop: function() {
		foodPerPerson = 2; // DEBUG VALUE = 0 - ORIGINAL VALUE = 2
		foodNeeds = PlayerVillage.resources.population*foodPerPerson;

		if (PlayerVillage.resources.food >= foodNeeds) {
			
			PlayerVillage.updateResources('food', -foodNeeds);
			
			Crafty.e('GameLogText').GameLogText(PlayerVillage.resources.population + ' people ate '
				+ foodNeeds + ' total units of food.');
		} else if (PlayerVillage.resources.food < foodNeeds) {
			// if you don't have enough food to feed everybody, eat all current food
			
			// calculate how many will starve
			diff = foodNeeds - PlayerVillage.resources.food;
			
			PlayerVillage.updateResources('food', -PlayerVillage.resources.food);
			
			// and apply the negative number to the population, starving them to death.
			starved = -Math.round((-diff)/foodPerPerson);
			PlayerVillage.updateResources('population', -starved);
			
			Crafty.e('GameLogText').GameLogText(starved + ' people starved due to lack of food.');
			
			if (PlayerVillage.resources.population <= 0) {
				Crafty.scene('Lose');
			}
		}
		
		if (PlayerVillage.resources.population >= 100) {
			Crafty.scene('Win');
		}
	}
});