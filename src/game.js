/*
	game.js
	The root of all things. Initialization and global structures.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

// the world map and associated methods
World = {
	map: Crafty.isometric.size(64),
	
	map_width: function() { return 16; },
	
	map_height: function() { return 38; },
	
	map_tiles: []
}

Buildings = {
	types: [
		'TestBuilding',
		'Farm',
		'House'
		],
	
	costs: [
		{ type: 'TestBuilding', wood: 10, food: 0, stone: 0 },
		{ type: 'Farm', wood: 0, food: 10, stone: 0 },
		{ type: 'House', wood: 10, food: 15, stone: 5 }
		],
	
	buildMenuList: [
		'TestBuilding',
		'Farm',
		'House',
		'Close'
		],
	
	lookupCost: function(building) {
		return this.costs[this.types.indexOf(building)];
	}
}

// an object to keep track of the player's village
PlayerVillage = {
	tasks: [],
	
	taskHandler: null,
	
	resources: {
		wood: 0,
		food: 10,
		stone: 0,
		population: 1
	},
	
	updateResources: function(resourceType, number) {
		if (resourceType == 'wood') {
			this.resources.wood  += number;
		} else if (resourceType == 'food') {
			this.resources.food += number;
		} else if (resourceType == 'stone') {
			this.resources.stone += number;
		} else if (resourceType == 'population') {
			this.resources.population += number;
		} else {
			return;
		}
		
		Crafty.trigger('PlayerResourcesUpdated');
	}
}

// mouse controller
MouseController = {
	state: 'gameplay',
	
	possibleStates: [
		'gameplay',	// when the mouse is being used for gameplay purposes ex. selecting tiles

		'gui'		// when the mouse is being used for gui elements ex. menus
	],
	
	changeState: function(stateIn) {
		if (this.possibleStates.indexOf(stateIn) == -1) {
			console.log('Failed to change mouse state: state not extant');
			return;
		} else {
			this.state = stateIn;
		}
	}
}

// the Game object begins the game.
Game = {
	// width & height of the stage
	width: function() {
		return 2048;
	},
	
	height: function() {
		return 2048;
	},
	
	// width & height of the viewport
	viewportWidth: function() {
		return 1024;
	},
	
	viewportHeight: function() {
		return 640;
	},
	
	// z-coordinates for various elements
	sky_Z: function() {
		return Game.height()/16 + 1;
	},
	
	gui_Z: function() {
		return Game.sky_Z() + 1;
	},
	
	// init function
	start: function() {
		// start up Crafty. Set the background color to an eye-searing violet.
		Crafty.init(Game.width(), Game.height());
		Crafty.viewport.init(Game.viewportWidth(), Game.viewportHeight());
		Crafty.background('rgb(100,224,150)');
		
		Crafty.scene("Loading");
	}
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center', 'white-space': 'nowrap' }
$tooltip_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center',
	'white-space': 'nowrap' }