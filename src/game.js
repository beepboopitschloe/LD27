/*
	game.js
	The root of all things. Initialization and global structures.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

// the world map and associated methods
World = {
	map: Crafty.isometric.size(64),
	
	map_width: function() { return 32; },
	
	map_height: function() { return 32; },
	
	map_tiles: []
}

Buildings = {
	types: [
		'TestBuilding',
		'Farm'
		],
	
	costs: [
		{ wood: 10, food: 0, stone: 0 },
		{ wood: 0, food: 10, stone: 0 }
		],
	
	buildMenuList: [
		'TestBuilding',
		'Farm',
		'Close'
		],
	
	lookupCost: function(building) {
		return this.costs[this.types.indexOf(building)];
	}
}

// an object to keep track of the player's village
PlayerVillage = {
	resources: {
		wood: 0,
		food: 10,
		stone: 0
	},
	
	updateResources: function(resourceType, number) {
		console.log('updating ' + resourceType + " by " + number);
		if (resourceType == 'wood') {
			this.resources.wood  += number;
		} else if (resourceType == 'food') {
			this.resources.food += number;
			console.log(this.resources.food + " food");
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