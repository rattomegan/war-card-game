/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const cardLookUp = {
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
};

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
let pPile, pHand;
let cPile, cHand;
let scores, winner; 

// I've moved this out of the getNewShuffledDeck function and made it a let variable so it can change - this doesn't actually matter. it works as a const variable as well.
const masterDeck = buildMasterDeck();
const newShuffledDeck = [];

let pHandEl, cHandEl, newPCard, newCCard;

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
  

//could probably put this whole function back into the init function.
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
  cHand = [];
  pHand = [];
  winner = null;
  renderScores();

  // NEED TO SPLIT THIS INTO A RENDER FUNCTION
  buttonEl.innerText = textLookup.button.play;
  // remove rules from the page
  textEls.rules.innerText = '';
  // cardEls.masterDeck.className = '';
  cardEls.piles.p.style.opacity = '100';
  cardEls.piles.c.style.opacity = '100';
}  

function handleTurn() {
  if (pPile.length === 0 || cPile.length === 0) return getWinner();
  pHand.push(pPile.shift());
  cHand.push(cPile.shift());
  renderCards();
  if (pHand[0].value === cHand[0].value) return buttonEl.textContent = textLookup.button.war;
  pHand[0].value > cHand[0].value ? winner = 'p' : winner = 'c';
  winner === 'p' ? buttonEl.textContent = textLookup.button.take : buttonEl.textContent = textLookup.button.give;
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
  if (evt.target.innerText === textLookup.button.revealLoss) return renderFlipCards();
  if (evt.target.innerText === textLookup.button.revealGain) return renderFlipCards();
  if (evt.target.innerText === textLookup.button.take) return takeCards();
  if (evt.target.innerText === textLookup.button.give) return takeCards();
}



function runWar() {
    // the render function here will need to reference the index number of the war array to match the id of the card <div>
  if (pPile.length < 4 || cPile.length < 4) return getWinner();
  pHand.push(...pPile.splice(0, 4));
  cHand.push(...cPile.splice(0, 4));
  renderCards();
  if (pHand[pHand.length - 1].value === cHand[cHand.length - 1].value) return runWar();
  if (pHand[pHand.length - 1].value > cHand[pHand.length - 1].value) {
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
    textEls.rules.classList.add('winner-message');
    textEls.rules.innerHTML = `YOU WIN! <br> Can't believe you made it to the end of this game.`;
    buttonEl.innerText = 'Game Over. No reset because why would you want to.';
    buttonEl.style.fontSize = '16px';
  } else {
    winner = 'c';
    cardEls.piles.p.style.opacity = '0';
    textEls.rules.classList.add('winner-message');
    textEls.rules.innerHTML = `YOU LOSE. <br> But you're still a winner since you made it to the end of this game.`;
    buttonEl.innerText = 'Game Over. No reset because why would you want to.';
    buttonEl.style.fontSize = '16px';
  }
  

};


function renderScores() {
  // render the scores by looping through each scoreEl.
  for (let score in scores) {
    scoreEls[score].textContent = scores[score];
  };
  // making specific count text visible
  document.querySelector('.p-count').style.opacity = '100';
  document.querySelector('.c-count').style.opacity = '100';
};


function renderCards() {
  pHandEl = document.getElementById('p-hand');
  pHand.forEach(function(card, i) {
    if (!(i % 4)) {
      if(i > 4) {
        let newPCard = document.createElement('div');
        newPCard.setAttribute('id', `'p-card${i}'`);
        pHandEl.append(newPCard);
        cardEls.p[i] = newPCard;
        cardEls.p[i].style.marginTop = '-125px'
      }
      cardEls.p[i].className = `card xlarge ${card.face} card-container shadow`; 
    } else { 
      if(i > 4) {
        let newPCard = document.createElement('div');
        newPCard.setAttribute('id', `'p-card${i}'`)
        pHandEl.append(newPCard);
        cardEls.p[i] = newPCard;
        cardEls.p[i].style.marginTop = '-125px'
      }
      cardEls.p[i].className = `card xlarge back card-container shadow`;
    }
  })
  cHandEl = document.getElementById('c-hand');
  cHand.forEach(function(card, i) { 
    if (!(i % 4)) {
      if(i > 4) {
        let newCCard = document.createElement('div');
        newCCard.setAttribute('id', `'c-card${i}'`)
        cHandEl.append(newCCard);
        cardEls.c[i] = newCCard;
        cardEls.c[i].style.marginTop = '-125px'
      }
      cardEls.c[i].className = `card xlarge ${card.face} card-container shadow`; 
    } else {
      if(i > 4) {
        let newCCard = document.createElement('div');
        newCCard.setAttribute('id', `'c-card${i}'`)
        cHandEl.append(newCCard);
        cardEls.c[i] = newCCard;
        cardEls.c[i].style.marginTop = '-125px'
      }
      cardEls.c[i].className = `card xlarge back card-container shadow`;
    }
  })
};


function renderFlipCards() {
  for (let i = 0; i < pHand.length; i++) {
    if(cardEls.p[i].className === `card xlarge back card-container shadow`) {
      cardEls.p[i].className = `card xlarge ${pHand[i].face} card-container shadow`;
    }
  }
  for (let i = 0; i < cHand.length; i++) {
    if(cardEls.c[i].className === `card xlarge back card-container shadow`) {
      cardEls.c[i].className = `card xlarge ${cHand[i].face} card-container shadow`;
    }
  }
  winner === 'p' ? buttonEl.textContent = textLookup.button.take : buttonEl.textContent = textLookup.button.give;
};
