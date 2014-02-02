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
	// Indicates if game is playing.
	$scope.gamePlaying = false;
	// Indicates if game was launched once.
	$scope.gameLaunched = false;
	// Indicates if player is blocked to perform any actions on board.
	$scope.gameBlocked = false;
	// Level of computer's "intelligence".
	$scope.level = LEVEL_NORMAL;
	// Difference between player and computer scores to win in a game.
	$scope.scoreDiffToWin = 1;
	// Represents number of non-tie rounds to win in a game.
	$scope.numberOfScoreToWin = 2;
	// Contains information about game winner.
	$scope.gameResult = '';
	// Contains a mark assigned to player.
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

		// Empty round message.
		$scope.roundInfo = '';
	}

	$scope.resetCounters = function() {
		// Reset player's score.
		$scope.playerWins = 0;
		// Reset computer's score.
		$scope.computerWins = 0;
		// Reset round number;
		$scope.round = 0;
	}

	$scope.resetHistory = function() {
		$scope.history = [];
	}

	/**
	 * Player's click handler.
	 * Marks empty cell and checks if the round is finished.
	 */
	$scope.markCell = function(cell) {
		if (cell.value || !$scope.gamePlaying || $scope.gameBlocked) {
			// If cell is already marked or game is finished/blocked then do nothing.
		} else {
			// Mark cell.
			cell.value = $scope.getNextMark();
			// Block player to perform any actions on board.
			$scope.gameBlocked = true;
			// Update round message.
			$scope.roundInfo = "Computer's move...";

			if (!$scope.checkIfRoundFinished()) {
				// If round is not finished then let computer to make an action.
				$timeout($scope.computerMove, 500);
			}
		}
	};

	/**
	 * Returns mark for next move.
	 */
	$scope.getNextMark = function() {
		if ($scope.lastMark == 'o') {
			$scope.lastMark = 'x';
		} else {
			$scope.lastMark = 'o';
		}

		return $scope.lastMark;
	}

	$scope.checkIfRoundFinished = function() {
		var roundResult = $scope.isRoundFinished();
		if (roundResult) {
			$scope.finishRound(roundResult);
			return true;
		}
		return false;
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

	/**
	 * Finishes round and checks if game is finished.
	 */
	$scope.finishRound = function(result) {
		if (result == GAME_WIN) {
			// Add score to player.
			$scope.playerWins++;
		} else if (result == GAME_LOSE) {
			// Add score to computer.
			$scope.computerWins++;
		}
		// Update rounds history.
		$scope.history.push({'status': result});
		// Update round message.
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

	/**
	 * New game button handler.
	 */
	$scope.newGame = function() {
		$scope.resetBoard();
		$scope.resetCounters();
		$scope.resetHistory();

		$scope.gameLaunched = true;
		$scope.gamePlaying = true;
		$scope.roundInfo = '';
		$scope.gameResult = '';

		$scope.newRound();
	}

	/**
	 * Starts new round.
	 */
	$scope.newRound = function() {
		// Increase round number.
		$scope.round++;
		$scope.resetBoard();
		$scope.roundPlaying = true;
		$scope.gameBlocked = false;

		// Check who's moves first.
		$scope.playerMovesFirst = $scope.isPlayerMovesFirst();
		if ($scope.playerMovesFirst == true) {
			$scope.playerMark = 'x';
			$scope.roundInfo = "Your move";
		} else {
			$scope.playerMark = 'o';
			$scope.computerMove();
		}

	}

	/**
	 * Rotates moving order.
	 */
	$scope.isPlayerMovesFirst = function() {
		if ($scope.playerMovesFirst == true) {
			return false;
		} else if ($scope.playerMovesFirst == false) {
			return true;
		} else {
			return Math.floor((Math.random() * 10)) > 4;
		}
	}

	/**
	 * Checks if game is finished.
	 * Returns true when score difference is enough to win and necessary number of rounds were played.
	 */
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

	$scope.computerMove = function() {
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
		
		// Unblock the game so player can mark some cells.
		$scope.gameBlocked = false;
		$scope.roundInfo = "Your move";

		return true;
	}

	/**
	 * Strategy 1: mark center -> corner -> side -> victory combination.
	 * Computer level: low.
	 */
	$scope.computerMoveOptionOne = function() {
		var i;
		var cell;

		// Check center cell, return cell's number if cell is empty.
		if (!$scope.cells[centerCell].value) {
			return centerCell;
		}

		cell = $scope.selectCornerCellsOrdered();
		if (cell === false) {
			return $scope.selectSideCellsOrdered();
		} else {
			return cell;
		}

		// Check compbination, return if next move leads to victory or prevents the fall.
		for (i = 0; i < victoryCombinations.length; i++) {
			var a = victoryCombinations[i][0];
			var b = victoryCombinations[i][1];
			var c = victoryCombinations[i][2];
			var cellA = $scope.cells[a].value;
			var cellB = $scope.cells[b].value;
			var cellC = $scope.cells[c].value;
			// First condition: watch the cells with same values only.
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
	 * Strategy 1 (modified): mark center -> prevent/force victory combination -> mark corner or side.
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
