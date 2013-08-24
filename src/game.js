/*
	game.js
	The root of all things. Initialization and global structures.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

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

	map: Crafty.isometric.size(64),
	map_width: function() { return 32; },
	map_height: function() { return 32; },
	map_tiles: [],
	
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