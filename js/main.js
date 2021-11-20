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

const masterDeck = buildMasterDeck();

function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of war
          value: Number(rank) || cardLookUp[rank]
        });
      });
    });
    return deck;
  }

const player1 = {
    // holds deck of cards to be played and cards that are won will be pushed to the end of the array
    curCard: [],
    // holds the current card played
    playCard: [],
    // the four war cards in a war scenario
    warCards: [],
}

const computer = {
    curCard: [],
    playCard: [],
    warCards: [],
}

  // -----------------------------------------------------------
  // don't touch anything above this line.

/*----- app's state (variables) -----*/
let gameDeck, winner;


/*----- cached element references -----*/

const warEls = {
  pCard1: '',
  pCard2: '',
  pCard3: '',
  pCard4: '',
  cCard1: '',
  cCard2: '',
  cCard3: '',
  cCard4: '',
}

const pCardEl = document.getElementById('p-card1');
const pBackEl = document.getElementById('p-back');
const cCardEl = document.getElementById('c-card1');
const cBackEl = document.getElementById('c-back');

/*----- event listeners -----*/
document.getElementById('start-game').addEventListener('click', renderGame);
document.getElementById('play-card').addEventListener('click', playRound);
document.getElementById('replay').addEventListener('click', renderGame);

/*----- functions -----*/

init();

function init() {

}  

renderDeckInContainer(masterDeck, document.getElementById('master-deck-container'));

  function renderDeckInContainer(deck, container) {
  container.innerHTML = '';
  // Let's build the cards as a string of HTML
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
  // const cardsHtml = deck.reduce(function(html, card) {
  //   return html + `<div class="card ${card.face}"></div>`;
  // }, '');
  container.innerHTML = cardsHtml;
}

  function getNewShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
  }

/*----- app's state (variables) -----*/
/*----- cached element references -----*/
/*----- event listeners -----*/
/*----- functions -----*/


// create contestants objects with multiple arrays within: main pile for pulling, pile for card gains, pile for cards on board
//  player deck and player hand (current card)


// create master deck array. 
// asign image values to each index number in master array

// event listeners
// 1. start game
// 2. play card

//initialize the game:
//  1. split values from the master deck array randomly to each player array

// handle turn:
// 1. function to pull first value index from player 1 array
//      a. display card image based on array
// 2. function to pull first value card from computer array
//      a. display card image based on array index
// 3. compare value of player1 card to computer.
//      a. if player1 card is higher than computer, add card to bottom of player 1 array
//      b. if computer card is higher, add card to end of computer array
//      c. if value is the same - run tie scenario - link to tie function? or keep inside?
//          i. tie function:
//              - pull three more idx face down, fourth one is revealed.
//              - compare fourth card, run tie function again if needed.

// win scenario and variable
// 1. when one player array length equals 52 or one array is empty declare winner

// handle player wanting to replay









/*----- constants -----*/


// // Build a 'master' deck of 'card' objects used to create shuffled decks
// const masterDeck = buildMasterDeck();
// renderDeckInContainer(masterDeck, document.getElementById('master-deck-container'));

// /*----- app's state (variables) -----*/
// let shuffledDeck;

// /*----- cached element references -----*/
// const shuffledContainer = document.getElementById('shuffled-deck-container');

// /*----- event listeners -----*/
// document.querySelector('button').addEventListener('click', renderNewShuffledDeck);

// /*----- functions -----*/
// function getNewShuffledDeck() {
//   // Create a copy of the masterDeck (leave masterDeck untouched!)
//   const tempDeck = [...masterDeck];
//   const newShuffledDeck = [];
//   while (tempDeck.length) {
//     // Get a random index for a card still in the tempDeck
//     const rndIdx = Math.floor(Math.random() * tempDeck.length);
//     // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
//     newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
//   }
//   return newShuffledDeck;
// }

// function renderNewShuffledDeck() {
//   // Create a copy of the masterDeck (leave masterDeck untouched!)
//   shuffledDeck = getNewShuffledDeck();
//   renderDeckInContainer(shuffledDeck, shuffledContainer);
// }

// function renderDeckInContainer(deck, container) {
//   container.innerHTML = '';
//   // Let's build the cards as a string of HTML
//   let cardsHtml = '';
//   deck.forEach(function(card) {
//     cardsHtml += `<div class="card ${card.face}"></div>`;
//   });
//   // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
//   // const cardsHtml = deck.reduce(function(html, card) {
//   //   return html + `<div class="card ${card.face}"></div>`;
//   // }, '');
//   container.innerHTML = cardsHtml;
// }

// renderNewShuffledDeck();