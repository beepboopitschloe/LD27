/*
	scenes.js
	Herein lie the scene definitions to be used in the game.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

Crafty.scene('Game', function() {
	this.debugText = Crafty.e('2D, DOM, Text')
		.attr({ x: 4, y: 4 } )
		.text("PRESS SPACE TO INITIATE THE 10sec DAY/NIGHT CYCLE :: CAN YOU REACH 100 POPULATION?")
		.css($text_css)
		.bind('ViewportMovement', function(coords) {
			this.attr( { x: -coords.x + 4, y: -coords.y + 4 } );
		});
	
	this.resourceText = Crafty.e('PlayerInfoText');
	
	this.fps = Crafty.e('FPSText');
	
	this.debugText.attach(this.resourceText);
	this.debugText.attach(this.fps);
	
	// set up invisible controllers
	//var screenControl = Crafty.e('ScreenScroll'); BROKEN
	Game.mouseHandler = Crafty.e('MouseHandler');
	PlayerVillage.taskHandler = Crafty.e('TaskHandler');
	PlayerVillage.popHandler = Crafty.e('PopHandler');
	
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
			num = randomNumber(0, 20);
			
			if (x == World.map_width()/2 && y == World.map_height()/2) {
				tile = Crafty.e('House');
			} else if (num <= 3) {
				tile = Crafty.e('Tree');
			} else if (num > 3 && num < 7) {
				tile = Crafty.e('BerryBush');
			} else if (num > 7 && num <= 10) {
				tile = Crafty.e('Stone');
			} else {
				tile = Crafty.e('Grass');
			}
			World.map.place(x, y, 0, tile);
			tile.tileSetup([x,y]);
			if (tile.has('TileLogic')) {
				tile.setZusingY();
			}
			World.map_tiles[x][y] = tile;
		}
	}
	
	// loop through again and set up tile neighbors
	for (var x = area.x.start; x < area.x.end; x++) {
		for (var y = area.y.start; y < area.y.end; y++) {
			World.map_tiles[x][y].setupNeighbors();
		}
	}
	
	// set up the sky.
	var sky = Crafty.e('Sky').attr({z: Game.height()/16 + 1});
	// init mouse control
	//var mouseController = Crafty.e('MouseController');
	
	// play music
	Crafty.audio.play('game_music', -1);
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
		'assets/stone.gif',
		'assets/berry_bush.gif',
		
		// building assets
		'assets/building_plot.gif',
		'assets/farm.gif',
		'assets/house.gif',
		'assets/granary.gif',
		'assets/sample_building_64.gif',
		
		// GUI assets
		'assets/build_menu_options.gif',
		
		// music assets
		'assets/game.mp3',
		'assets/game.ogg',
		'assets/game.aac',
		
		// sound assets
		'assets/built.mp3',
		'assets/built.ogg',
		'assets/built.aac'
		], function() {
			// terrain assets
			Crafty.sprite(64, 'assets/grass.gif', { spr_grass: [0,0] });
			Crafty.sprite(64, 'assets/tree.gif', { spr_tree: [0,0] });
			Crafty.sprite(64, 'assets/stone.gif', { spr_stone: [0,0] });
			Crafty.sprite(64, 'assets/berry_bush.gif', { spr_berry_bush: [0,0] });
			
			// building assets
			Crafty.sprite(64, 'assets/building_plot.gif', { spr_building_plot: [0,0] });
			Crafty.sprite(64, 'assets/farm.gif', { spr_farm: [0,0] });
			Crafty.sprite(64, 'assets/house.gif', { spr_house: [0,0] });
			Crafty.sprite(64, 'assets/granary.gif', { spr_granary: [0,0] });
			Crafty.sprite(64, 'assets/sample_building_64.gif', { spr_building: [0,0] });
			
			// GUI assets
			Crafty.sprite(128, 16, 'assets/build_menu_options.gif', {
					opt_build_menu: [0, 0]
				});
			
			// music assets
			Crafty.audio.add( {
				game_music: [
					'assets/game.mp3',
					'assets/game.ogg',
					'assets/game.aac'
					],
				building_built: [
					'assets/built.mp3',
					'assets/built.ogg',
					'assets/built.aac'
					]
			});
			
			// enter game scene
			Crafty.scene("Game");
	});
});

Crafty.scene('Lose', function() {
	this.failureText = Crafty.e('2D, DOM, Text')
		.attr( {
			x: Game.viewportWidth()/4,
			y: Game.viewportHeight()/4 } )
			.text(" YOU LOSE, PRESS REFRESH TO TRY AGAIN ")
			.css($lose_css);
});

Crafty.scene('Lose', function() {
	this.failureText = Crafty.e('2D, DOM, Text')
		.attr( {
			x: Game.viewportWidth()/4,
			y: Game.viewportHeight()/4 } )
			.text(" A WINNER IS YOU ")
			.css($win_css);
});