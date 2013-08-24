/*
	scenes.js
	Herein lie the scene definitions to be used in the game.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

Crafty.scene('Game', function() {
	this.debugText = Crafty.e('2D, DOM, Text')
		.attr({ x: 3, y: 3 } )
		.text("POTENTIAM LIMITATAM")
		.css($text_css);

	var map = Crafty.isometric.size(64);
	var area = {
		x: {
			start: 0,
			end: 32 },
		y: {
			start: 0,
			end: 32 }
		};
	
	console.log(area.x.start + " to " + area.x.end);
	console.log(area.y.start + " to " + area.y.end);
	
	for (var x = area.x.start; x < area.x.end; x++) {
		for (var y = area.y.start; y < area.y.end; y++) {
			tile = Crafty.e("Grass");
			map.place(x, y, 0, tile);
		}
	}

	map.place(5, 5, 0, Crafty.e("Building"));
	map.place(7, 6, 0, Crafty.e("Building"));
	map.place(4, 5, 0, Crafty.e("Building"));
	
	Crafty.e('Actor');
	
	Crafty.viewport.mouselook(true);
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
		'assets/building.gif'
		], function() {
			Crafty.sprite(64, 'assets/grass_template_64.gif', { spr_grass: [0,0] });
			Crafty.sprite(64, 'assets/sample_building_64.gif', { spr_building: [0,0] });
			
			// enter game scene
			Crafty.scene("Game");
	});
});