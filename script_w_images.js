const gameContainer = document.getElementById("game");
let showCardCount = 0;
let firstCard = document.createElement('div');
let secondCard = document.createElement("div");
const startButton = document.querySelector('#start-button');
const startDiv = document.querySelector('#start');
let totalClicks = 0;
const lineBreak = document.createElement("br");
const totCardNum = document.querySelector('#tot-card-num');

// Create the score display element
const score = document.createElement('h2');
score.innerHTML = `Current Score: ${totalClicks}`;

// Retrieve best score (i.e. lowest score)
let storedCardNum = JSON.parse(localStorage.getItem("num_of_card")) || 0;
let bestScore = JSON.parse(localStorage.getItem("best_score")) || 0;

// Display the best score on start page
const bestScoreH2 = document.createElement("h2");
// bestScoreH2.innerHTML = `Best/Lowest Score: ${bestScore}`;
// startDiv.prepend(bestScoreH2);


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// let shuffledColors = shuffle(COLORS);


// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(cardNumArray) {

  // Display the best score
  bestScoreH2.innerHTML = `Best/Lowest Score: ${bestScore}`;
  gameContainer.append(bestScoreH2);

  // Display total clicks count as the current score.
  gameContainer.append(score, lineBreak);
  
  // Display cards
  let cardId = 1;
  for (let num of cardNumArray) {
    // create a new div
    const newCard = document.createElement("img");
    newCard.style.height = "200px";
    newCard.style.margin = "10px";

    newCard.id = cardId;

    // Load default image Joker + add class
    newCard.src = "PNG-cards-1.3/66.png";
    newCard.classList.add(`card${num+1}`);

    // call a function handleCardClick when a div is clicked on
    newCard.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newCard);

    cardId++;
  }

  // Make a restart button
  const restartBtn = document.createElement('button');
  restartBtn.innerText = "Play Again!";
  restartBtn.addEventListener("click", restartGame);
  gameContainer.append(lineBreak, restartBtn);
}


// This function determines whether to show cards clicked and update score dispalyed
function handleCardClick(event) {
  // If less than two cards are shown, flip the card clicked
  if (showCardCount < 2) {
    event.target.src = `PNG-cards-1.3/${event.target.className.substr(4)}.png`;
    showCardCount++;

    // Inrement total click count by 1 and update the displayed score
    totalClicks++;
    score.innerHTML = `Current Score: ${totalClicks}`;
  }

  // Save the first card div to a variable for comparison later
  if (showCardCount === 1) {
    firstCard = event.target;
  }
  else if (showCardCount === 2){
    secondCard = event.target;
    if ((firstCard.id == secondCard.id) || (firstCard.className != secondCard.className)) {
      showCardCount = 3;
      setTimeout(() => {
        firstCard.src = "PNG-cards-1.3/66.png";
        secondCard.src = "PNG-cards-1.3/66.png";
        showCardCount = 0;
        }, 1000);
    } else {
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      showCardCount = 0;
    }
  }
}


// Add a start button to start the game
startButton.addEventListener("click", (event) => {
  // Hide the starting page
  startDiv.style.display = "none";

  // Draw cards
  let shuffledCards = drawCards();

  // Display game div with cards div added
  createDivsForColors(shuffledCards);
});

// Randomly draw cards
function drawCards() {
    let totCardNumInt = parseInt(totCardNum.value);
    if (!totCardNum.value) {
      totCardNumInt = storedCardNum;
    } else if (totCardNum.value && totCardNumInt != storedCardNum) {
      // Reset best score if number of cards changed
      storedCardNum = totCardNumInt;
      localStorage.setItem("num_of_card", storedCardNum);
      bestScore = 0;
      localStorage.setItem("best_score", bestScore);
    }
    let numArray = [...Array(totCardNumInt).keys()];
    numArray = numArray.concat(numArray);
    let shuffledCards = shuffle(numArray);

    return shuffledCards;
}


// Add a restart button to restart the game
function restartGame(event) {
  // Remove all cards from the game div
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }

  // Update best score if needed.
  if (bestScore === 0 || (totalClicks < bestScore && totalClicks >= storedCardNum)) {
    bestScore = totalClicks;
    localStorage.setItem("best_score", bestScore);
    bestScoreH2.innerHTML = `Best/Lowest Score: ${bestScore}`;
  }

  // Reset Current Score
  totalClicks = 0;
  score.innerHTML = `Current Score: ${totalClicks}`;
  
  // Reshuffle cards and place them in the game div.
  let shuffledCards = drawCards();
  createDivsForColors(shuffledCards);
}
