/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const cardLookUp = {
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
};

const masterDeck = buildMasterDeck();

const textLookup = {
    button: {
      new: 'New Game',
      play: 'Play Card',
      take: 'Collect Cards',
      give: 'Surrender Cards',
      war: 'Go to War',
      revealLoss: 'Reveal Losses',
      revealGain: 'Reveal Gains',
    },
}

/*----- app's state (variables) -----*/

// need to remove cardRank if I do not use it.
let pPile, pHand;
let cPile, cHand;
let scores, cardRank, winner; 

// I've moved this out of the getNewShuffledDeck function and made it a let variable so it can change - this doesn't actually matter. it works as a const variable as well.
const newShuffledDeck = [];


/*----- cached element references -----*/
const cardEls = {
    p: {
      0: document.getElementById('p-card0'),
      1: document.getElementById('p-card1'),
      2: document.getElementById('p-card2'),
      3: document.getElementById('p-card3'),
      4: document.getElementById('p-card4'),
    },
    c: {
      0: document.getElementById('c-card0'),
      1: document.getElementById('c-card1'),
      2: document.getElementById('c-card2'),
      3: document.getElementById('c-card3'),
      4: document.getElementById('c-card4'),
    },
    piles: {
      p: document.getElementById('p-pile'),
      c: document.getElementById('c-pile'),
    },
    masterDeck: document.getElementById('master-deck'),
};

const scoreEls = {
  p: document.getElementById('p-score'),
  c: document.getElementById('c-score'),
};

const textEls = {
  rules: document.querySelector('.rules'),  
  pWin: document.getElementById('p-win-message'),
  cWin: document.getElementById('c-win-message'),
};

const buttonEl = document.getElementById('button');

/*----- event listeners -----*/
buttonEl.addEventListener('click', handleClick)

/*----- functions -----*/
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
};
  

//could probably put this whole function back inot the init function.
function dealDeck() {
  getNewShuffledDeck();  
  // here we are splitting the newShuffledDeck in 2 and assigning to the game piles
  pPile = newShuffledDeck.splice(0, (newShuffledDeck.length / 2))
  cPile = newShuffledDeck.splice(0, newShuffledDeck.length);
  // newShuffleDeck is now an empty array since we spliced out all the elements.
};

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
  renderScores();
  buttonEl.innerText = textLookup.button.play;
  // remove rules from the page
  textEls.rules.innerText = '';
  cardEls.masterDeck.className = '';
  cardEls.piles.p.style.opacity = '100';
  cardEls.piles.c.style.opacity = '100';
}  

function handleTurn() {
  // if (pPile.length === 0 || cPile.length === 0) return getWinner();
  pHand.push(pPile.shift());
  cHand.push(cPile.shift());
  renderCards();
  if (pHand[0].value === cHand[0].value) return buttonEl.textContent = textLookup.button.war;
  pHand[0].value > cHand[0].value ? winner = 'p' : winner = 'c';
  winner === 'p' ? buttonEl.textContent = textLookup.button.take : buttonEl.textContent = textLookup.button.give;
  // TO DO ------ results text content HERE o equal the value of the winner card over the loser card
  if (winner === 'p') {
    textEls.pWin.innerText = `You win this round! Collect both cards.` // ${pHand.length + cHand.length} 
  } else {
    textEls.cWin.innerText = `The computer wins this round! Surrender your card.` //${pHand.length + cHand.length}
  };
};

function takeCards() {
  pHand[(pHand.length - 1)].value > cHand[(cHand.length - 1)].value ? pPile.push(...pHand.splice(0, pHand.length), ...cHand.splice(0, cHand.length)) : cPile.push(...pHand.splice(0, pHand.length), ...cHand.splice(0, cHand.length));
  scores.p = pPile.length;
  scores.c = cPile.length;
  renderScores();
  for (const [key] of Object.entries(cardEls.p)) { 
    cardEls.p[key].className = '';
  }
  for (const [key] of Object.entries(cardEls.c)) { 
    cardEls.c[key].className = '';
  }
  buttonEl.innerText = textLookup.button.play;
  textEls.cWin.innerText = ''
  textEls.pWin.innerText = ''
};



function handleClick(evt) {
  if (evt.target.innerText === textLookup.button.new) return init();
  if (evt.target.innerText === textLookup.button.play) return handleTurn();
  if (evt.target.innerText === textLookup.button.war) return runWar();
  if (evt.target.innerText === textLookup.button.revealLoss) return flipCards();
  if (evt.target.innerText === textLookup.button.revealGain) return flipCards();
  if (evt.target.innerText === textLookup.button.take) return takeCards();
  if (evt.target.innerText === textLookup.button.give) return takeCards();
}



function runWar(pFirstWar = [], cFirstWar = []) {
  if (pFirstWar.length > 0) renderOldCards(pFirstWar, cFirstWar); // create this new function

  // the render function here will need to reference the index number of the war array to match the id of the card <div>
  // if (pPile.length < 4 || cPile.length < 4) // send to run win scenario? and have a comparison of scores there?
  pHand.push(...pPile.splice(0, 4));
  cHand.push(...cPile.splice(0, 4));
  renderCards();
  if (pHand[4].value === cHand[4].value) { 
    // when someone wins I need to mkae sure these push to main piles.
    pFirstWar.push(...pHand.splice(0, 4));
    cFirstWar.push(...cHand.splice(0, 4));
    return runWar(pFirstWar, cFirstWar); // maybe i make this a separate function that runs lots of wars and creates all the divs
  } else if (pHand[4].value > cHand[4].value) {
      winner = 'p';
      textEls.pWin.innerText = `You win this war! Collect all ${pHand.length + cHand.length} cards.`  
      buttonEl.innerText = textLookup.button.revealGain;
  } else {
      winner = 'c';
      textEls.cWin.innerText = `The computer wins this war! Surrender all ${pHand.length + cHand.length} cards.`
      buttonEl.innerText = textLookup.button.revealLoss;
    }
};


// I will need to revisit this function tomorrow as I'm not sure it will wrok properly.
function getWinner() {
  if(pPile.length > cPile.length) {
    winner = 'p';
    cardEls.piles.c.style.opacity = '0';
  } else {
    winner = 'c';
    cardEls.piles.p.style.opacity = '0';
  }

};

// render scores and take cards could possibly one function
function renderScores() {
  // render the scores
  for (let score in scores) {
    scoreEls[score].textContent = scores[score];
  };
};



function renderCards() {
  for (let i = 0; i < pHand.length; i++) {
    switch (i) {
      case 0: cardEls.p[i].className = `card xlarge ${pHand[i].face} card-container`; 
      break;
      case 4: cardEls.p[i].className = `card xlarge ${pHand[i].face} card-container`;
      break;
      default: cardEls.p[i].className = `card xlarge back card-container`;
    }
  }
  for (let i = 0; i < cHand.length; i++) {
    switch (i) {
      case 0: cardEls.c[i].className = `card xlarge ${cHand[i].face} card-container`; 
      break;
      case 4: cardEls.c[i].className = `card xlarge ${cHand[i].face} card-container`;
      break;
      default: cardEls.c[i].className = `card xlarge back card-container`;
    }
  }
};

function flipCards() {
  for (let i = 0; i < pHand.length; i++) {
    if(cardEls.p[i].className === `card xlarge back card-container`) {
      cardEls.p[i].className = `card xlarge ${pHand[i].face} card-container`;
    }
  }
  for (let i = 0; i < cHand.length; i++) {
    if(cardEls.c[i].className === `card xlarge back card-container`) {
      cardEls.c[i].className = `card xlarge ${cHand[i].face} card-container`;
    }
  }
  winner === 'p' ? buttonEl.textContent = textLookup.button.take : buttonEl.textContent = textLookup.button.give;
};




// // ------------- Original render cards function------------>
// //Chris said not to use parameters in the function.
//   // renderCards(pHand, cardEls.p);
//   // renderCards(cHand, cardEls.c);
// function renderCards(hand, container) {

//   for (let i = 0; i < hand.length; i++) {
//     if (i === 0 || i === hand.length) {
//     container[i].className = `card ${hand[i].face} card-container`;
//     } else {
//       container[i].className = `card back card-container`;
//     }
    
//     // ----> less efficient way to do the above
//     // container[i].className = ''
//     // container[i].classList.add(`card`, `${hand[i].face}`, `card-container`);
//   }
// } //------------------------------------------------------->

// // ------------------- If Else renderCards() function----------------->
// function renderCards2() {
//   for (let i = 0; i < pHand.length; i++) {
//     if (i === 0) {
//       cardEls.p[i].className = `card ${pHand[i].face} card-container`; 
//     } else if (i === 4) {
//       cardEls.p[i].className = `card ${pHand[i].face} card-container`;
//     } else {
//       cardEls.p[i].className = `card back card-container`;
//     }
//   }
//   for (let i = 0; i < cHand.length; i++) {
//     if (i === 0) {
//       cardEls.c[i].className = `card ${cHand[i].face} card-container`; 
//     } else if (i === 4) {
//       cardEls.c[i].className = `card ${cHand[i].face} card-container`;
//     } else {
//       cardEls.c[i].className = `card back card-container`;
//     }
//   }
// }



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