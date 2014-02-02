angular.module('gameTicTacToeFilters', []).filter('victory', function() {
	return function(input) {
		return input == 1 ? 'won' : 'lose';
	};
});