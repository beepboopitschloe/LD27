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
		'Granary',
		'House'
		],
	
	costs: [
		{ type: 'TestBuilding', wood: 10, food: 0, stone: 0 },
		{ type: 'Farm', wood: 0, food: 10, stone: 0 },
		{ type: 'Granary', wood: 15, food: 10, stone: 10 },
		{ type: 'House', wood: 10, food: 15, stone: 5 }
		],
	
	benefitStrings: [
		{ type: 'TestBuilding', str: 'It\'s pretty.' },
		{ type: 'Farm', str: 'Produces 5 food every 3 days.' },
		{ type: 'Granary', str: 'Produces 1 food per neighboring farm every 3 days.' },
		{ type: 'House', str: 'Adds 2 to your population.' }
		],
	
	buildMenuList: [
		'TestBuilding',
		'Farm',
		'Granary',
		'House',
		'Close'
		],
	
	lookupCost: function(building) {
		return this.costs[this.types.indexOf(building)];
	},
	
	lookupBenefitString: function(building) {
		return this.benefitStrings[this.types.indexOf(building)];
	}
}

// an object to keep track of the player's village
PlayerVillage = {
	tasks: [],
	
	taskHandler: null,
	
	popHandler: null,
	
	resources: {
		wood: 0,
		food: 10,
		stone: 0,
		population: 0
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

// the Game object begins the game.
Game = {
	// width & height of the stage
	width: function() {
		return 1024;
	},
	
	height: function() {
		return 640;
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
	
	// mouse controller
	mouseHandler: null,
	
	// init function
	start: function() {
		// start up Crafty. Set the background color to an eye-searing violet.
		Crafty.init(Game.width(), Game.height());
		Crafty.viewport.init(Game.viewportWidth(), Game.viewportHeight());
		Crafty.background('rgb(50,25,100)');
		
		Crafty.scene("Loading");
	}
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center', 'white-space': 'nowrap' }
$tooltip_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center',
	'white-space': 'nowrap' }
$lose_css = { 'font-size': '32px', 'font-family': 'Arial', 'color': 'red', 'style': 'bold', 'text-align': 'center', 'white-space': 'nowrap' }
$win_css = { 'font-size': '32px', 'font-family': 'Arial', 'color': 'lime', 'style': 'bold', 'text-align': 'center', 'white-space': 'nowrap' }