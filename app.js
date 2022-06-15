// To do: Complete validation for sloped directions
document.addEventListener("DOMContentLoaded", () => {
  const squares = document.querySelectorAll(".grid div");
  const result = document.querySelector("#result");
  const currentPlayerDisplay = document.querySelector("#current-player");

  let currentPlayer = 1;
  let boardWidth = 7;
  let boardHeight = 6;
  let taken = 0;
  let lastPlaced;
  let gameOver = false;

  function checkWin(lastPlaced, squares, playerName) {
    let verticalMatch = false;
    let positivelySlopedMatch = false;
    let negativelySlopedMatch = false;
    let horizontalMatch = false;

    const verticalNeighbours = [
      // Below the most recently dropped piece
      lastPlaced + boardWidth,
      lastPlaced + boardWidth * 2,
      lastPlaced + boardWidth * 3,
    ];

    const horizontalNeighbours = [
      // To the right of the most recently dropped piece
      [lastPlaced + 1, lastPlaced + 2, lastPlaced + 3],
      // To the left of the most recently dropped piece
      [lastPlaced - 1, lastPlaced - 2, lastPlaced - 3],
    ];

    const positivelySlopedNeighbours = [
      // Positively sloped from the most recently dropped piece
      [
        lastPlaced + boardHeight,
        lastPlaced + boardHeight * 2,
        lastPlaced + boardHeight * 3,
      ],
      [
        lastPlaced - boardHeight,
        lastPlaced - boardHeight * 2,
        lastPlaced - boardHeight * 3,
      ],
    ];

    const negativelySlopedNeighbours = [
      // Negatively sloped from the most recently dropped piece
      [
        lastPlaced + boardWidth + 1,
        lastPlaced + (boardWidth + 1) * 2,
        lastPlaced + (boardWidth + 1) * 3,
      ],
      [
        lastPlaced - boardWidth + 1,
        lastPlaced - (boardWidth + 1) * 2,
        lastPlaced - (boardWidth + 1) * 3,
      ],
    ];

    // Vertical neighbours validation
    if (
      verticalNeighbours[0] > boardWidth * boardHeight - 1 ||
      verticalNeighbours[1] > boardWidth * boardHeight - 1 ||
      verticalNeighbours[2] > boardWidth * boardHeight - 1
    ) {
      verticalMatch = false;
    } else if (
      squares[verticalNeighbours[0]].classList.contains(playerName) &&
      squares[verticalNeighbours[1]].classList.contains(playerName) &&
      squares[verticalNeighbours[2]].classList.contains(playerName)
    ) {
      verticalMatch = true;
    }

    // Horizontal neigbours validation
    if (
      (horizontalNeighbours[0][0] % boardWidth == boardHeight ||
        horizontalNeighbours[0][1] % boardWidth == boardHeight) &&
      (horizontalNeighbours[1][0] % boardWidth == 0 ||
        horizontalNeighbours[1][1] % boardWidth == 0)
    ) {
      horizontalMatch = false;
    } else if (
      (squares[horizontalNeighbours[0][0]].classList.contains(playerName) &&
        squares[horizontalNeighbours[0][1]].classList.contains(playerName) &&
        squares[horizontalNeighbours[0][2]].classList.contains(playerName)) ||
      (squares[horizontalNeighbours[1][0]].classList.contains(playerName) &&
        squares[horizontalNeighbours[1][1]].classList.contains(playerName) &&
        squares[horizontalNeighbours[1][2]].classList.contains(playerName)) ||
      (squares[horizontalNeighbours[0][0]].classList.contains(playerName) &&
        squares[horizontalNeighbours[1][0]].classList.contains(playerName) &&
        squares[horizontalNeighbours[1][1]].classList.contains(playerName)) ||
      (squares[horizontalNeighbours[1][0]].classList.contains(playerName) &&
        squares[horizontalNeighbours[0][0]].classList.contains(playerName) &&
        squares[horizontalNeighbours[0][1]].classList.contains(playerName))
    ) {
      horizontalMatch = true;
    }

    // Positively sloping neighbours validation
    if (
      positivelySlopedNeighbours[0][0] > boardWidth * boardHeight - 1 ||
      positivelySlopedNeighbours[0][1] > boardWidth * boardHeight - 1 ||
      positivelySlopedNeighbours[0][2] > boardWidth * boardHeight - 1
    ) {
      positivelySlopedMatch = false;
    } else if (
      (squares[positivelySlopedNeighbours[0][0]].classList.contains(
        playerName
      ) &&
        squares[positivelySlopedNeighbours[0][1]].classList.contains(
          playerName
        ) &&
        squares[positivelySlopedNeighbours[0][2]].classList.contains(
          playerName
        )) ||
      (squares[positivelySlopedNeighbours[1][0]].classList.contains(
        playerName
      ) &&
        squares[positivelySlopedNeighbours[1][1]].classList.contains(
          playerName
        ) &&
        squares[positivelySlopedNeighbours[1][2]].classList.contains(
          playerName
        )) ||
      (squares[positivelySlopedNeighbours[0][0]].classList.contains(
        playerName
      ) &&
        squares[positivelySlopedNeighbours[1][0]].classList.contains(
          playerName
        ) &&
        squares[positivelySlopedNeighbours[1][1]].classList.contains(
          playerName
        )) ||
      (squares[positivelySlopedNeighbours[1][0]].classList.contains(
        playerName
      ) &&
        squares[positivelySlopedNeighbours[0][0]].classList.contains(
          playerName
        ) &&
        squares[positivelySlopedNeighbours[0][1]].classList.contains(
          playerName
        ))
    ) {
      positivelySlopedMatch = true;
    }

    // Negatively sloping neighbours
    if (
      negativelySlopedNeighbours[0][0] > boardWidth * boardHeight - 1 ||
      negativelySlopedNeighbours[0][1] > boardWidth * boardHeight - 1 ||
      negativelySlopedNeighbours[0][2] > boardWidth * boardHeight - 1
    ) {
      negativelySlopedMatch = false;
    } else if (
      squares[negativelySlopedNeighbours[0][0]].classList.contains(
        playerName
      ) &&
      squares[negativelySlopedNeighbours[0][1]].classList.contains(
        playerName
      ) &&
      squares[negativelySlopedNeighbours[0][2]].classList.contains(playerName)
    ) {
      negativelySlopedMatch = true;
    }
    return (
      verticalMatch ||
      horizontalMatch ||
      negativelySlopedMatch ||
      positivelySlopedMatch
    );
  }

  for (let i = 0; i < squares.length - boardWidth; i++) {
    squares[i].onclick = () => {
      if (gameOver == false) {
        if (taken == boardHeight * boardWidth) {
          alert("It's a Draw");
        } else if (squares[i + boardWidth].classList.contains("taken")) {
          if (
            squares[i].classList.contains("player-one") ||
            squares[i].classList.contains("player-two")
          ) {
            alert("Token already placed!");
          } else if (currentPlayer == 1) {
            squares[i].classList.add("taken");
            squares[i].classList.add("player-one");

            taken++;
            lastPlaced = i;

            if (checkWin(lastPlaced, squares, "player-one") == true) {
              alert("Player 1 wins!");
              gameOver = true;
            } else {
              currentPlayer = 2;
              currentPlayerDisplay.innerHTML = currentPlayer;
            }
          } else {
            squares[i].classList.add("taken");
            squares[i].classList.add("player-two");

            taken++;
            lastPlaced = i;

            if (checkWin(lastPlaced, squares, "player-two") == true) {
              alert("Player 2 wins!");
              gameOver = true;
            } else {
              currentPlayer = 1;
              currentPlayerDisplay.innerHTML = currentPlayer;
            }
          }
          console.log("Taken: " + taken);
        } else {
          alert("Cannot place token here!");
        }
      }
    };
  }
});
