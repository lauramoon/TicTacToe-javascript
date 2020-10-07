const turnArray = ["", "X", "O", "X", "O", "X", "O", "X", "O", "X"];
const player = ["Computer", "Human"];
let emptyCells = new Set(["r1c1d1", "r1c2", "r1c3d2", "r2c1", "r2c2d1d2", "r2c3", "r3c1d2", "r3c2", "r3c3d1"]);
let started = false;
let humanTurn = false;
let turn = 1;
let symbol = turnArray[turn];
let mode = 'random';
$("#playAgain").hide();
$(".btn").text(" ");

$(".button").click(function() {
  let userClick = $(this).attr("id");

  if (userClick === "startNow") {
    startGame();

  } else if (userClick === "playAgain") {
    restart();

  } else if (started && humanTurn && emptyCells.has(userClick)) {
    playMove(userClick);
  }
});

function startGame() {
  started = true;
  $(".settings").hide();
  let first = $("input[name=first]:checked").val();
  mode = $("input[name=mode]:checked").val();

  if (first === "human") {
    humanTurn = true;
    $("h2").text("Human (X) to play");
  } else {
    $("h2").text("Computer (O) to play");
    setTimeout(function() {
      playMove(getMove());
    }, 600);
  }
}

function getMove() {
  if (mode === 'random') {
    return getRandomMove();
  } else if (mode === 'casual') {
    if (turn < 4) {
      return getRandomMove();
    } else {
      return getCasualMove();
    }
  } else {
    return getSmartMove();
  }
}

function playMove(move) {
  $("#"+ move).text(symbol);
  emptyCells.delete(move);

  if (checkWin(move)){
    $("h2").text(player[(humanTurn ? 1:0)] + " Wins!");
    $("#playAgain").show();
    started = false;
  } else {
    turn++;
    humanTurn = !humanTurn;
    if (turn === 10) {
      $("h2").text("The game is a draw");
      $("#playAgain").show();
      started = false;
    } else {
      symbol = turnArray[turn];
      $("h2").text(player[(humanTurn ? 1:0)] + " (" + symbol + ") to play");
    }
    if (!humanTurn && turn < 10) {
      setTimeout(function() {
        playMove(getMove());
      }, 1000);
    }
  }
}

function checkWin(cell) {
  let result = false;
  for (let i = 0; i < cell.length; i += 2) {
    let checkClass = cell.slice(i, i+2);
    let value = 0;
    $("." + checkClass).map(function() {
      if ($(this).find(".btn").text() === symbol) {
        value++;
      }
    });
    if (value === 3) {
      result = true;
      break;
    }
  }
  return result;
}

function restart() {
  emptyCells = new Set(["r1c1d1", "r1c2", "r1c3d2", "r2c1", "r2c2d1d2", "r2c3", "r3c1d2", "r3c2", "r3c3d1"]);
  turn = 1;
  symbol = turnArray[turn];
  humanTurn = false;
  $(".settings").show();
  $(".btn").text(" ");
  $("#playAgain").hide();
  $("h2").text("Settings");
}

function getRandomMove() {
  let moveArray = Array.from(emptyCells);
  let randomNumber = Math.floor(Math.random()*moveArray.length);
  return moveArray[randomNumber];
}

function getCasualMove() {
  let result = getWinOrBlock();

  if (result === "none") {
    return getRandomMove();
  } else {
    return result;
  }
}

function getSmartMove() {
  if (turn === 1) {
    return 'r2c2d1d2';
  } else if (turn === 2) {
    if ($("#r2c2d1d2").text() === " ") {
      return 'r2c2d1d2';
    } else {
      return 'r1c1d1';
    }
  } else if (turn === 3) {
    if ($("#r1c2").text() === 'O' || $("#r2c3").text() === 'O') {
      return 'r1c3d2';
    } else if ($("#r2c1").text() === 'O' || $("#r3c2").text() === 'O') {
      return 'r3c1d2';
    } else if ($("#r1c1d1").text() === 'O') {
      return 'r3c3d1';
    } else if ($("#r1c3d2").text() === 'O') {
      return 'r3c1d2';
    } else if ($("#r3c3d1").text() === 'O') {
      return 'r1c1d1';
    } else {
      return 'r1c3d2';
    }
  } else if (turn === 4) {
    let block = getWinOrBlock();
    if (block != 'none') {
      return block;
    } else if ($("#r2c2d1d2").text() === "X") {
      return 'r3c1d2';
    } else if (($('#r1c1d1').text() === "X" && $('#r3c3d1').text() === 'X') || ($('#r3c1d2').text() === "X" && $('#r1c3d2').text() == 'X')) {
      return 'r1c2';
    } else if (($('#r2c1').text() === 'X' && $('#r2c3').text() === 'X') || ($('#r1c2').text() === 'X' && $('#r2c3').text() === 'X')) {
      return 'r1c1d1';
    } else if (($('#r1c1d1').text() === 'X') && ($('#r3c2').text() === 'X' || $('#r2c3').text() === 'X')) {
      return 'r3c3d1';
    } else if (($('#r1c3d2').text() === 'X') && ($('#r2c1').text() === 'X' || $('#r3c2').text() === 'X')) {
      return 'r3c1d2';
    } else if (($('#r3c1d2').text() === 'X') && ($('#r1c2').text() === 'X' || $('#r2c3').text() === 'X')) {
      return 'r1c3d2';
    } else {
      return 'r1c1d1';
    }
  } else if (turn === 5) {
    let block = getWinOrBlock();
    if (block != 'none') {
      return block;
    } else if ($('#r1c1d1').text() === 'X') {
      if ($('#r1c2').text() === 'O') {
        return 'r2c1';
      } else {
        return 'r1c2';
      }
    } else if ($('#r1c3d2').text() === 'X') {
      if ($('#r1c2').text() === 'O') {
        return 'r2c3';
      } else {
        return 'r1c2';
      }
    } else if ($('#r3c1d2').text() === 'X') {
      if ($('#r3c2').text() === 'O') {
        return 'r2c1';
      } else {
        return 'r3c2';
      }
    } else {
      if ($('#r3c2').text() === 'O') {
        return 'r2c3';
      } else {
        return 'r3c2';
      }
    }
  } else {
    let block = getWinOrBlock();
    if (block === 'none') {
      return getRandomMove();
    } else {
      return block;
    }
  }
}

function getWinOrBlock() {
  let block = 'none';
  let symbolOther = turnArray[turn+1];
  let empties = Array.from(emptyCells);
  for (let i = 0; i < empties.length; i++) {
    cell = empties[i];
    for (let i = 0; i < cell.length; i += 2) {
      let checkClass = cell.slice(i, i+2);
      let value = 0;
      $("." + checkClass).map(function() {
        if ($(this).find(".btn").text() === symbol) {
          value += 1;
        } else if ($(this).find(".btn").text() === symbolOther) {
          value -= 1;
        }
      });
      if (value == 2) {
        return cell;
      } else if (value == -2) {
        block = cell;
      }
    }
  }
  return block;
}
