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
	
	this.resourceText = Crafty.e('PlayerInfoText');
	
	var fps = Crafty.e('FPSText');
	
	var area = {
		x: {
			start: 0,
			end: World.map_width() },
		y: {
			start: 0,
			end: World.map_height() }
		};
	
	console.log(area.x.start + " to " + area.x.end);
	console.log(area.y.start + " to " + area.y.end);
	
	for (var x = area.x.start; x < area.x.end; x++) {
		World.map_tiles[x] = [];
		for (var y = area.y.start; y < area.y.end; y++) {
			tile = Crafty.e("Grass");
			World.map.place(x, y, 0, tile);
			tile.tileSetup([x,y]);
			
			World.map_tiles[x][y] = tile;
		}
	}
	
	World.map.place(5, 5, 0, Crafty.e('Tree'));
	
	// set up the sky.
	var sky = Crafty.e('Sky').attr({z: Game.height()/16 + 1});
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
		// terrain assets
		'assets/grass.gif',
		'assets/tree.gif',
		
		// building assets
		'assets/building_plot.gif',
		'assets/sample_building_64.gif',
		
		// GUI assets
		'assets/build_menu_options.gif'
		], function() {
			// terrain assets
			Crafty.sprite(64, 'assets/grass.gif', { spr_grass: [0,0] });
			Crafty.sprite(64, 'assets/tree.gif', { spr_tree: [0,0] });
			
			// building assets
			Crafty.sprite(64, 'assets/building_plot.gif', { spr_building_plot: [0,0] });
			Crafty.sprite(64, 'assets/farm.gif', { spr_farm: [0, 0] });
			Crafty.sprite(64, 'assets/sample_building_64.gif', { spr_building: [0,0] });
			
			// GUI assets
			Crafty.sprite(128, 16, 'assets/build_menu_options.gif', {
					opt_build_menu: [0, 0]
				});
			
			// enter game scene
			Crafty.scene("Game");
	});
});