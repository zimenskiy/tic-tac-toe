const GAME_WIN = 'You won';
const GAME_LOSE = 'You lose';
const GAME_TIE = 'Tie';

const LEVEL_EASY = 'easy';
const LEVEL_NORMAL = 'normal';

var victoryCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

var cornerCells = [0, 2, 6, 8];
var sideCells = [1, 3, 5, 7];
var centerCell = 4;

var gameTicTacToe = angular.module('gameTicTacToe', []);

gameTicTacToe.controller('GameController', ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.gamePlaying = false;
	$scope.gameLaunched = false;
	$scope.gameBlocked = false;
	$scope.level = LEVEL_NORMAL;
	// Different in score to win in a game.
	$scope.scoreDiffToWin = 1;
	$scope.numberOfScoreToWin = 2;
	$scope.gameResult = '';
	$scope.playerMark = '';

	$scope.resetBoard = function() {
		$scope.cells = [
			{'value': ''},
			{'value': ''},
			{'value': ''},
			{'value': ''},
			{'value': ''},
			{'value': ''},
			{'value': ''},
			{'value': ''},
			{'value': ''},
		];

		// Each game must start with 'x' move, so last (previous) mark is set to 'o'.
		$scope.lastMark = 'o';

		$scope.roundInfo = '';
	}

	$scope.resetCounters = function() {
		$scope.playerWins = 0;
		$scope.computerWins = 0;
		$scope.round = 0;
	}

	$scope.resetHistory = function() {
		$scope.history = [];
	}

	$scope.markCell = function(cell) {
		if (cell.value || !$scope.gamePlaying || $scope.gameBlocked) {
			// If cell is already marked or game is finished then do nothing.
		} else {
			cell.value = $scope.getNextMark();
			$scope.gameBlocked = true;
			$scope.roundInfo = "Computer's move...";

			if (!$scope.checkIfRoundFinished()) {
				$timeout($scope.computerMove, 500);
			}
		}
	};


	$scope.checkIfRoundFinished = function() {
		var roundResult = $scope.isRoundFinished();
		if (roundResult) {
			$scope.finishRound(roundResult);
			return true;
		}
		return false;
	}

	$scope.getNextMark = function() {
		if ($scope.lastMark == 'o') {
			$scope.lastMark = 'x';
		} else {
			$scope.lastMark = 'o';
		}

		return $scope.lastMark;
	}

	$scope.newGame = function() {
		$scope.resetBoard();
		$scope.resetCounters();
		$scope.resetHistory();

		$scope.gameLaunched = true;
		$scope.gamePlaying = true;
		$scope.roundInfo = '';
		$scope.gameResult = '';

		$scope.newRound();

		// var ar = [
		// 	[$scope.cells[0].value, $scope.cells[0].value, $scope.cells[0].value],
		// 	['1', 					$scope.cells[0].value, $scope.cells[0].value],
		// 	[$scope.cells[0].value, '1',	   			   $scope.cells[0].value],
		// 	[$scope.cells[0].value, $scope.cells[0].value, '1'					],
		// 	['1',					'1', 				   $scope.cells[0].value],
		// 	[$scope.cells[0].value, '1', 				   '1' 					],
		// 	['1', 					$scope.cells[0].value, '1'					],
		// 	['1',					'1',					'1'					],
		// ];

		// for (var i=0; i< ar.length; i++) {
		// 	cellA = ar[i][0];
		// 	cellB = ar[i][1];
		// 	cellC = ar[i][2];
		// 	console.log(parseInt(cellA) + ' ' + parseInt(cellB) + ' ' + parseInt(cellC) + ' ------');
		// 	console.log(!cellA ^ !cellB ^ !cellC);
		// 	console.log((cellA || cellB || cellC) == true );
		// }

	}

	$scope.isPlayerMovesFirst = function() {
		if ($scope.playerMovesFirst == true) {
			return false;
		} else if ($scope.playerMovesFirst == false) {
			return true;
		} else {
			return Math.floor((Math.random() * 10)) > 4;
		}
	}

	$scope.newRound = function() {
		$scope.round++;
		$scope.resetBoard();
		$scope.roundPlaying = true;
		$scope.gameBlocked = false;

		$scope.playerMovesFirst = $scope.isPlayerMovesFirst();
		if ($scope.playerMovesFirst == true) {
			$scope.playerMark = 'x';
			$scope.roundInfo = "Your move";
		} else {
			$scope.playerMark = 'o';
			$scope.computerMove();
		}

	}

	$scope.finishRound = function(result) {
		if (result == GAME_WIN) {
			$scope.playerWins++;
		} else if (result == GAME_LOSE) {
			$scope.computerWins++;
		}
		$scope.history.push({'status': result});
		$scope.roundInfo = result;
		$scope.gameBlocked = true;
		$scope.roundPlaying = false;

		if ($scope.isGameFinished()) {
			$scope.roundInfo = '';
			$scope.gameResult = $scope.getGameResultMessage();
			$scope.gamePlaying = false;
		} else {
			// Start new round after a while.
			$timeout($scope.newRound, 1500);
		}
	}

	$scope.isGameFinished = function() {
		return (Math.abs($scope.playerWins - $scope.computerWins) >= $scope.scoreDiffToWin) && (Math.max($scope.playerWins, $scope.computerWins) >= $scope.numberOfScoreToWin);
	}

	$scope.getGameResultMessage = function() {
		if ($scope.playerWins > $scope.computerWins) {
			return 'Victory!';
		} else if ($scope.playerWins < $scope.computerWins) {
			return 'Failure!';
		} else {
			return GAME_TIE;
		}
	}

	$scope.isRoundFinished = function() {
		for (var i = 0; i < victoryCombinations.length; i++) {
			var a = victoryCombinations[i][0];
			var b = victoryCombinations[i][1];
			var c = victoryCombinations[i][2];	
			var cellA = $scope.cells[a].value;
			var cellB = $scope.cells[b].value;
			var cellC = $scope.cells[c].value;		
			if ((cellA) && (cellA == cellB) && (cellA == cellC)) {
				if ($scope.cells[a].value == $scope.playerMark) {
					$scope.cells[a].win = true;
					$scope.cells[b].win = true;
					$scope.cells[c].win = true;
					return GAME_WIN;
				} else {
					$scope.cells[a].lose = true;
					$scope.cells[b].lose = true;
					$scope.cells[c].lose = true;
					return GAME_LOSE;
				}
			}
		}

		// Check if no more moves
		var nonEmptyCells = 0;
		for (var i = 0; i < $scope.cells.length; i++) {
			if ($scope.cells[i].value) {
				nonEmptyCells++;
			}
		}
		if (nonEmptyCells == $scope.cells.length) {
			return GAME_TIE;
		}

		return false;
	}

	$scope.computerMove = function() {
		$scope.gameBlocked = false;
		$scope.roundInfo = "Your move";

		var cell;
		switch ($scope.level) {
			case LEVEL_EASY:
				cell = $scope.computerMoveOptionOne();
				break;

			case LEVEL_NORMAL:
				cell = $scope.computerMoveOptionTwo();
				break;

			default:
				cell = $scope.computerMoveOptionOne();
		}
		
		$scope.cells[cell].value = $scope.getNextMark();

		$scope.checkIfRoundFinished();
				
		return true;
	}

	/**
	 * Strategy 1: mark center -> corner -> side or prevent/force victory combination.
	 * Computer level: low.
	 */
	$scope.computerMoveOptionOne = function() {
		var i;
		var cell;

		// Check center cell, return if empty.
		if (!$scope.cells[centerCell].value) {
			return centerCell;
		}

		cell = $scope.selectCornerCellsOrdered();
		if (cell === false) {
			return $scope.selectSideCellsOrdered();
		} else {
			return cell;
		}

		// Check compbination, return if next move leads to victory.
		for (i = 0; i < victoryCombinations.length; i++) {
			var a = victoryCombinations[i][0];
			var b = victoryCombinations[i][1];
			var c = victoryCombinations[i][2];
			var cellA = $scope.cells[a].value;
			var cellB = $scope.cells[b].value;
			var cellC = $scope.cells[c].value;
			// First condition: check the cells with same values only.
			// Second condition: one of the cells only must be empty.
			// Third condition: at least one of the cells must not be empty. This one excludes an option when all cells are empty.
			if (((cellA == cellB) || (cellB == cellC) || (cellA == cellC)) && (!cellA ^ !cellB ^ !cellC) && (cellA || cellB || cellC)) {
				if (!cellA) {
					return a;
				} else if (!cellB) {
					return b;
				} else {
					return c;
				}
			}
		}
	}

	/**
	 * Strategy 1 (modified): mark center -> corner OR side or prevent/force victory combination.
	 * Computer level: strong.
	 */
	$scope.computerMoveOptionTwo = function() {
		var i;
		var cell;

		// Check center cell, return if empty.
		if (!$scope.cells[centerCell].value) {
			return centerCell;
		}

		// Check compbination, return if next move leads to victory.
		for (i = 0; i < victoryCombinations.length; i++) {
			var a = victoryCombinations[i][0];
			var b = victoryCombinations[i][1];
			var c = victoryCombinations[i][2];
			var cellA = $scope.cells[a].value;
			var cellB = $scope.cells[b].value;
			var cellC = $scope.cells[c].value;
			// First condition: check the cells with same values only.
			// Second condition: one of the cells only must be empty.
			// Third condition: at least one of the cells must not be empty. This one excludes an option when all cells are empty.
			if (((cellA == cellB) || (cellB == cellC) || (cellA == cellC)) && (!cellA ^ !cellB ^ !cellC) && (cellA || cellB || cellC)) {
				if (!cellA) {
					return a;
				} else if (!cellB) {
					return b;
				} else {
					return c;
				}
			}
		}

		if (Math.random() * 10 > 4) {
			cell = $scope.selectCornerCellsRandomly();
			if (cell === false) {
				return $scope.selectSideCellsRandomly();
			}
		} else {
			cell = $scope.selectSideCellsRandomly();
			if (cell === false) {
				return $scope.selectCornerCellsRandomly();
			}
		}

		return cell;
	}

	$scope.selectCornerCellsOrdered = function() {
		// Check corner cells, return first empty.
		for (i = 0; i < cornerCells.length; i++) {
			if (!$scope.cells[cornerCells[i]].value) {
				return cornerCells[i];
			}
		}
		return false;
	}

	$scope.selectCornerCellsRandomly = function() {
		var shuffle = cornerCells;
		shuffle.sort(function() {
			return 0.5 - Math.random();
		});

		for (i = 0; i < shuffle.length; i++) {
			if (!$scope.cells[shuffle[i]].value) {
				return shuffle[i];
			}
		}
		return false;
	}

	$scope.selectSideCellsOrdered = function() {
		// Check side cells, return first empty.
		for (i = 0; i < sideCells.length; i++) {
			if (!$scope.cells[sideCells[i]].value) {
				return sideCells[i];
			}
		}

		return false;
	}

	$scope.selectSideCellsRandomly = function() {
		var shuffle = sideCells;
		shuffle.sort(function() {
			return 0.5 - Math.random();
		});

		for (i = 0; i < shuffle.length; i++) {
			if (!$scope.cells[shuffle[i]].value) {
				return shuffle[i];
			}
		}

		return false;
	}

}]);
