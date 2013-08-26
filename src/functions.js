/*
	functions.js
	Some useful functions
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

function replaceTile(toReplace, replacement, isoMap, destroyOriginal) {
	// if one or both of the tiles doesn't use the TileLogic component, the function
	// will do nothing.
	if (!toReplace.has('TileLogic') || !replacement.has('TileLogic')) {
		console.log('replaceTile: one or both input tiles do not use the TileLogic component!');
		return;
	}
	
	// default argument for destroyOriginal: true
	destroyOriginal = typeof destroyOriginal !== 'undefined' ? destroyOriginal : true;
	
	// otherwise, run as normal.
	
	/* OFFSET STUFF
	offset = isoMap.px2pos(Crafty.viewport.x, Crafty.viewport.y);
	console.log('offset: ' + offset.x + ', ' + offset.y);
	console.log('orig: ' + toReplace.tile_x + ', ' + toReplace.tile_y);
	tog = { x: toReplace.tile_x + offset.x, y: toReplace.tile_y + offset.y };
	console.log('together: ' + tog.x + ', ' + tog.y);
	*/
	
	offset = { x: 0, y: 0 };
	
	isoMap.place(toReplace.tile_x + offset.x, toReplace.tile_y + offset.y, 0, replacement);
	replacement.tileSetup([toReplace.tile_x + offset.x, toReplace.tile_y + offset.y]);
	replacement.updateNeighbors();
	for (var i = 0; i < replacement.neighbors.length; i++) {
		replacement.neighbors[i].updateNeighbors();
	}
	replacement.setZusingY();
	
	if (destroyOriginal) {
		toReplace.deconstruct();
	}
	
	return 'replaceTile: success';
}

function randomNumber(min, max) {
	return (Math.floor(Math.random() * max) + min);
}