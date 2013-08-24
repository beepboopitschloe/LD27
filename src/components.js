/*
	components.js
	Herein lie the components to be used in the game.
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

// walking character
Crafty.c('Actor', {
	init: function() {
		this.requires("2D, Canvas, Color, Fourway")
			.attr( { w: 8, h: 8 } )
			.color('rgb(255, 150, 25)')
			.fourway(4);
	},
	
	visitBuilding: function(data) {
		building = data[0].obj;
		building.spawnInfoWindow();
	}
});

// grass tile
Crafty.c('Grass', {
	init: function() {
		this.requires("2D, Canvas, spr_grass");
	}
});

// test building
Crafty.c('Building', {
	init: function() {
		this.requires('2D, Canvas, Mouse, spr_building');
		
		this.tooltip = null;
		
		this.bind('MouseOver', function() {
			this.spawnInfoWindow();
		});
		
		this.bind('MouseOut', function() {
			this.destroyInfoWindow();
		});
	},
	
	spawnInfoWindow: function() {
		this.tooltip = Crafty.e('Tooltip');
	},
	
	destroyInfoWindow: function() {
		this.tooltip.deconstruct();
		this.tooltip = null;
	}
});