// game.js

let selectedCategory = '';
let cards = [];
let flippedCards = [];
let matchedCards = 0;
let score = 0;
let timer;
let timeLeft = 30;

// Categories with 8 pairs of items
const categories = {
  fruits: ['🍎', '🍌', '🍒', '🍇', '🍍', '🍓', '🍊', '🍉'],
  emojis: ['😀', '😂', '😍', '🥺', '😎', '🤔', '😅', '🥳'],
  animals: ['🐶', '🐱', '🐰', '🦊', '🐷', '🐮', '🐸', '🐨'],
  planets: ['🌍', '🌕', '🪐', '🌞', '🌑', '🌎', '🌒', '🌘'],
  flags: ['🇺🇸', '🇬🇧', '🇮🇳', '🇯🇵', '🇨🇦', '🇲🇽', '🇧🇷', '🇦🇺'],
};

// Start the game with the selected category
function startGame(category) {
  selectedCategory = category;
  cards = createCards(category);
  shuffleCards();
  displayCards();
  startTimer();
  document.querySelector('.landing-page').style.display = 'none';
  document.querySelector('.game-container').style.display = 'block';
  document.querySelector('#game-over').style.display = 'none';
}

// Create card pairs for the selected category
function createCards(category) {
  const items = categories[category];
  const cardPairs = [...items, ...items];  // Duplicate the items for matching pairs
  return cardPairs.map(item => {
    return { value: item, flipped: false, matched: false };
  });
}

// Shuffle the cards randomly
function shuffleCards() {
  cards = cards.sort(() => Math.random() - 0.5);
}

// Display the cards on the board
function displayCards() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('data-index', index);
    cardElement.innerText = card.flipped ? card.value : '';
    cardElement.addEventListener('click', () => handleCardClick(index));
    gameBoard.appendChild(cardElement);
  });
}

// Handle card click event
function handleCardClick(index) {
  const card = cards[index];
  if (card.flipped || card.matched) return;

  card.flipped = true;
  flippedCards.push(index);
  updateBoard();

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Check if the two flipped cards match
function checkMatch() {
  const [firstIndex, secondIndex] = flippedCards;
  const firstCard = cards[firstIndex];
  const secondCard = cards[secondIndex];

  if (firstCard.value === secondCard.value) {
    firstCard.matched = true;
    secondCard.matched = true;
    score += 10;
    matchedCards += 1;
    updateScore();

    if (matchedCards === cards.length / 2) {
      endGame(true);
    }
  } else {
    setTimeout(() => {
      firstCard.flipped = false;
      secondCard.flipped = false;
      updateBoard();
    }, 1000);
  }

  flippedCards = [];
}

// Update the board UI
function updateBoard() {
  const gameBoard = document.getElementById('game-board');
  cards.forEach((card, index) => {
    const cardElement = gameBoard.children[index];
    cardElement.innerText = card.flipped ? card.value : '';
    cardElement.classList.toggle('flipped', card.flipped);
    cardElement.classList.toggle('matched', card.matched);
  });
}

// Start the countdown timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

// Update the score
function updateScore() {
  document.getElementById('score').innerText = `Score: ${score}`;
}

// End the game
function endGame(won) {
  clearInterval(timer);
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('final-score').innerText = score;
  document.querySelector('.game-container').style.display = 'none';
}

// Restart the game
function restartGame() {
  timeLeft = 30;
  score = 0;
  matchedCards = 0;
  startGame(selectedCategory);
}
