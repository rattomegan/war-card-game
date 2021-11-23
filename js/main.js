/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// this is needed to update the ranking value in our build master deck function
const cardLookUp = {
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
};

// Build a 'master' deck of 'card' objects used to create shuffled decks
// this is now an array of objects with face and value as keys.
const masterDeck = buildMasterDeck();


/*----- app's state (variables) -----*/
// // this variable is updated in the original renderNewShuffledDeck function.
// let shuffledDeck;


// WonPiles will need to be shuffled at some point.
let pPile, pHand;
let cPile, cHand;
let scores, cardRank, winner; // will eventually be p or c



// I've moved this out of the getNewShuffledDeck function and made it a let variable so it can change - this doesn't actually matter. it works as a const variable as well.
const newShuffledDeck = [];


/*----- cached element references -----*/

const cardEls = {
    p: {
      pile: document.getElementById('p-pile'),
      0: document.getElementById('p-card0'),
      1: document.getElementById('p-card1'),
      2: document.getElementById('p-card2'),
      3: document.getElementById('p-card3'),
      4: document.getElementById('p-card4'),
    },
    c: {
      pile: document.getElementById('c-pile'),
      0: document.getElementById('c-card0'),
      1: document.getElementById('c-card1'),
      2: document.getElementById('c-card2'),
      3: document.getElementById('c-card3'),
      4: document.getElementById('c-card4'),
    }
  }

const scoreEls = {
  p: document.getElementById('p-score'),
  c: document.getElementById('c-score'),
}

  // button will change text depending on point in game
const buttonEl = document.getElementById('button');

/*----- event listeners -----*/
buttonEl.addEventListener('click', handleTurn)

/*----- functions -----*/
function getNewShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    // commenting below line out temporarily as I've moved it outside of this function.
    // const newShuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
  }
  
function buildMasterDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
          // this is setting the value of the rank from either the rank array or our cardLookUp object for the face cards.
        value: Number(rank) || cardLookUp[rank]
      });
    });
  });
  return deck;
}

function init() {
  buildMasterDeck();
  dealDeck();
  scores = {
    p: pPile.length,
    c: pPile.length
  }
  cardRank = {
    p: 0,
    c: 0
  }
  cHand = [];
  pHand = [];
  winner = null;

  // need to add render game board here. still need to write that function below.
}  

init();


function dealDeck() {
  getNewShuffledDeck();  
  // here we are splitting the newShuffledDeck in 2 and assigning to the game piles
  pPile = newShuffledDeck.splice(0, (newShuffledDeck.length / 2))
  cPile = newShuffledDeck.splice(0, newShuffledDeck.length);
  // newShuffleDeck is now an empty array since we spliced out all the elements.
};
  



function handleTurn(evt) {
    // when player clicks their card deck or play card button (this will be referenced from an event listener.)
  // check for win scenario  
  if (pPile.length === 0 || cPile.length === 0) return getWinner();
    // pull first value from player pile put it in play card array.
  // these methods are not working - pausing to continue with game logic
  pHand.push(pPile.shift());
  cHand.push(cPile.shift());

  renderCards(pHand, cardEls.p);
  renderCards(cHand, cardEls.c);
  if (pHand[0].value === cHand[0].value) return runWar();

  // update button text to "take cards" - this works
  buttonEl.textContent = 'Take Cards'

  // update these to splice instead of spread push. could also do pHand.length instead of (0, 1) - tried this below and got an infinite loop in running war.

  pHand[0].value > cHand[0].value ? pPile.push(...pHand.splice(0, 1), ...cHand.splice(0, 1)) : cPile.push(...pHand.splice(0, 1), ...cHand.splice(0, 1));
  // update scores and render score board.
  console.log(winner);
  scores.p = pPile.length;
  scores.c = cPile.length;
  renderScores();
  };

function runWar() {
  // the render function here will need to reference the index number of the war array to match the id of the card <div>
  // if (pPile.length < 4 || cPile.length < 4) // send to run win scenario? and have a comparison of scores there?
  pHand.push(...pPile.splice(0, 4));
  cHand.push(...cPile.splice(0, 4));
  renderCards(pHand, cardEls.p);
  renderCards(cHand, cardEls.c);
  if (pHand[3].value === cHand[3].value) {
    return runWar();
  } else if (pHand[3].value > cHand[3].value) {
      winner = "p";  
      pPile.push(...pHand.splice(0, 5));
      pPile.push(...cHand.splice(0, 5));
  } else {
      winner = "c";
      cPile.push(...pHand.splice(0, 5));
      cPile.push(...cHand.splice(0, 5));
    }

    scores.p = pPile.length;
    scores.c = cPile.length;
    renderScores();
// maybe return a render function here? where the cards physically move to the win pile and off the board.
};


// I will need to revisit this function tomorrow as I'm not sure it will wrok properly.
function getWinner() {
  if(pPile.length > cPile.length) {
    winner = "p";
  } else {
    winner = "c";
  }
};

function renderScores() {
  // render the scores
  for (let score in scores) {
    scoreEls[score].textContent = scores[score];
  };
};



function renderCards(hand, container) {

  for (let i = 0; i <= hand.length; i++) {
    if (i === 0 || i === hand.length) {
    container[i].className = `card ${hand[i].face} card-container`;
    } else {
      container[i].className = `card back card-container`;
    }
    
    // ----> less efficient way to do the above
    // container[i].className = ''
    // container[i].classList.add(`card`, `${hand[i].face}`, `card-container`);
  }
} 











      // // This is my original runWar function that includes warPiles. I have removed them to test just having one play pile.
// function runWar() {
//     // the render function here will need to reference the index number of the war array to match the id of the card <div>
//     // if (pPile.length < 4 || cPile.length < 4) run if statemetns below but for the lenght of the array. .length + 1 to include last array index;
//     pWarPile = pPile.splice(0, 4);
//     cWarPile = cPile.splice(0, 4);
//     // it is okay for this to be push right now since the war pile will be updated when the function reruns and the old values will be updated.
//     // this is currently pushing the whole array into the other array, creating separate arrays within the winPile. 
//     // return pWarPile[3].value > cWarPile[3].value ? pWinPile.push(pWarPile, cWarPile) : cWinPile.push(pWarPile, cWarPile)
//     if (pWarPile[3].value === cWarPile[3].value) {
//       runWar();
//     } else if (pWarPile[3].value > cWarPile[3].value) {
//       winner = "p";  
//       pWarPile.forEach(function(card) {
//             pPile.push(card);
//         })
//         cWarPile.forEach(function(card){
//             pPile.push(card);
//         })
//     } else {
//         winner = "c";
//         pWarPile.forEach(function(card) {
//             cPile.push(card);
//         })
//         cWarPile.forEach(function(card){
//             cPile.push(card);
//         })
//       }
//     // I'm not sure what to have it return here.
//     return winner // maybe return a render function here? where the cards physically move to the win pile and off the board.
// };
// 
