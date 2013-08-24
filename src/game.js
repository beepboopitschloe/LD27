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

	// init function
	start: function() {
		// start up Crafty. Set the background color to an eye-searing violet.
		Crafty.init(Game.width(), Game.height());
		Crafty.viewport.init(1024, 640);
		Crafty.background('rgb(100,224,150)');
		
		Crafty.scene("Loading");
	}
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }