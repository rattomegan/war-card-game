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

const player1 = {
    // holds deck of cards to be played and cards that are won will be pushed to the end of the array
    pile: [],
    // holds the current card played
    playCard: [],
    // the four war cards in a war scenario
    warCards: [],
}

const computer = {
    pile: [],
    playCard: [],
    warCards: [],
}

// I've moved this out of the getNewShuffledDeck function and made it a let variable so it can change - this doesn't actually matter. it works as a const variable as well.
const newShuffledDeck = [];

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
  const pBackEl = document.getElementById('p-pile');
  const cCardEl = document.getElementById('c-card1');
  const cBackEl = document.getElementById('c-pile');

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
    getNewShuffledDeck();
    // update game deck by splitting array with splice
    function dealDeck() {
      player1.pile = newShuffledDeck.splice(0, (newShuffledDeck.length / 2))
    //   console.log(player1.pile);
      computer.pile = newShuffledDeck.splice(0, newShuffledDeck.length);
    //   console.log(computer.pile);
    //   console.log(newShuffledDeck)
    };
    dealDeck();
  }  
  
  init();
  