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
	isoMap.place(toReplace.tile_x, toReplace.tile_y, 0, replacement);
	replacement.tileSetup([toReplace.tile_x, toReplace.tile_y]);
	replacement.setZusingY();
	
	if (destroyOriginal) {
		toReplace.destroy();
	}
	
	return 'replaceTile: success';
}