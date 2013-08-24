/*
	scenes.js
	Herein lie the scene definitions to be used in the game.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

Crafty.scene('Game', function() {
	this.debugText = Crafty.e('2D, DOM, Text')
		.attr({ x: 4, y: 4 } )
		.text("PRESS SPACE TO INITIATE THE DAY/NIGHT CYCLE")
		.css($text_css);
	
	var fps = Crafty.e('FPSText');
	
	var area = {
		x: {
			start: 0,
			end: Game.map_width() },
		y: {
			start: 0,
			end: Game.map_height() }
		};
	
	console.log(area.x.start + " to " + area.x.end);
	console.log(area.y.start + " to " + area.y.end);
	
	for (var x = area.x.start; x < area.x.end; x++) {
		Game.map_tiles[x] = [];
		for (var y = area.y.start; y < area.y.end; y++) {
			tile = Crafty.e("Grass");
			Game.map.place(x, y, 0, tile);
			Crafty.trigger('ItemPlaced');
			tile.tileSetup([x,y]);
			
			Game.map_tiles[x][y] = tile;
		}
	}

	Game.map.place(5, 5, 0, Crafty.e("Building"));
	Game.map.place(7, 6, 0, Crafty.e("Building"));
	Game.map.place(4, 5, 0, Crafty.e("Building"));
	Crafty.trigger('ItemPlaced');
	
	// set up the sky.
	var sky = Crafty.e('Sky').attr({z: 1});
	// init mouse control
	//var mouseController = Crafty.e('MouseController');
});

Crafty.scene('Loading', function() {
	// draw loading text
	this.loadingText = Crafty.e('2D, DOM, Text')
		.attr({ x: Game.width()/2, y: Game.width()/2 } )
		.text("LOADING")
		.css($text_css);
	
	// load assets
	Crafty.load([
		'assets/grass.gif',
		'assets/sample_building_64.gif'
		], function() {
			Crafty.sprite(64, 'assets/grass.gif', { spr_grass: [0,0] });
			Crafty.sprite(64, 'assets/sample_building_64.gif', { spr_building: [0,0] });
			
			// enter game scene
			Crafty.scene("Game");
	});
});