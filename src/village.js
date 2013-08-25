/*
	village.js
	These components and objects are used to handle the player village
	
	Created for Ludum Dare 27 - 10 Seconds
	(c) Noah Muth 2013
*/

Crafty.c('TaskHandler', {
	init: function() {
		console.log('task handler init');
		this.bind('TimeIsDay', function() {
			this.timeout(this.performTasks, 1000);
		});
	},
	
	add: function(task) {
		PlayerVillage.tasks.push(task);
	},
	
	performTasks: function() {
		taskList = PlayerVillage.tasks.reverse();
		PlayerVillage.tasks.reverse();
		unfinishedTasks = [];
		
		for (var i = 0; i < PlayerVillage.resources.population; i++) {
			task = taskList.pop();
			if (task == 'undefined') {
				continue;
			}
			
			if (task.has('NaturalResource')) {
				task.harvest();
			} else if (task.has('BuildingPlot')) {
				if (task.build() == 'fail') {
					unfinishedTasks.push(task);
					i -= 1;
				}
			} else if (task.has('ResourceProducer')) {
				if (task.yieldResources() == 'fail') {
					unfinishedTasks.push(task);
					i -= 1;
				}
			} else {
				continue;
			}
		}
		
		for (var i = 0; i < unfinishedTasks.length; i++) {
			this.add(unfinishedTasks.pop());
		}
	}
});