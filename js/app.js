const cardType = [
	'fa-diamond',
	'fa-paper-plane-o',
	'fa-anchor',
	'fa-bolt',
	'fa-cube',
	'fa-leaf',
	'fa-bicycle',
	'fa-bomb'
];

const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');
const stars = document.querySelector('.stars').getElementsByTagName('li');
const timerSelect = document.querySelector('.timer');
const playAgainButton = document.getElementById('play-again-button');
const modal = document.getElementById('modal-container');
let moves = 0;
let cardsArray = [];
let markCards = 0;
let startTimer;
let s = 0;
let minutes;
let seconds;
let timerOn = false;
let starsCount;
let plural;

// restart game if restart button is clicked
restart.addEventListener('click', function() {
	restartGame();
});

// hide modal if Play again button is pushed
playAgainButton.addEventListener('click', function() {
	modal.style.display = 'none';
});

// restart game and reset values
function restartGame() {
	moves = 0;
	cardsArray = [];
	markCards = 0;
	s = 0;
	timerOn = false;
	document.querySelector('.moves').textContent = moves;
	stopTimer();
	resetStars();
	removeCards();
	newDeck();
}

// newDeck() will create a new set of shuffled cards
function newDeck() {
	let shuffleCards = [];
		shuffleCards = shuffleCards.concat(cardType, cardType);
		shuffleCards = shuffle(shuffleCards);

	for (let i = 0; i < shuffleCards.length; i++) {
		const newCard = document.createElement('li');
		newCard.appendChild(document.createElement('i')).classList.add('fa', shuffleCards[i]);
		newCard.addEventListener('click', function(){
			matchCards(newCard);
		})

	deck.appendChild(newCard).className = 'card';
	}
}

// removeCards() will remove all cards from deck
function removeCards() {
	while (deck.firstChild) {
   		deck.removeChild(deck.firstChild);
	}
}

// match function will match two cards, hide if not the same
function matchCards(newCard) {
	// if card have match class or there are more than 2 cards in array, ignore and quit
	if ( newCard.className.match('match') || cardsArray.length === 2 ) {
		return;
	}

	if (timerOn == false){
		timerOn = true;
		timer();
	}

	newCard.classList.add('match', 'flip', 'animated');
    cardsArray.push(newCard);

    // winning logic, animation
    if (cardsArray.length > 1 && cardsArray[0].firstChild.className === cardsArray[1].firstChild.className) {
    	for (const card of cardsArray){
	    	card.classList.remove('animated', 'flip');
	        card.classList.add('animated', 'jello', 'green');
    	}
        cardsArray = [];
        movesCount();
        win();
    }
    // don't match logic, animation and hide cards
    else if (cardsArray.length > 1) {
    	setTimeout(function(){
    		setTimeout(function(){
    			for (const card of cardsArray){
	    			card.classList.remove('match', 'red', 'animated', 'swing');
	    		}
	    		cardsArray = [];
    		}, 500);
    		for (const card of cardsArray){
				card.classList.remove('animated', 'flip');
			    card.classList.add('red', 'animated', 'swing');
			}
    	}, 500);
        movesCount();
    }

    starRating();
}

// count moves and update textContent
function movesCount() {
	moves++;
	document.querySelector('.moves').textContent = moves;
	plural = moves === 1 ? '' : 's';
	document.querySelector('#movesStr').textContent = `Move${plural}`;
}

// if all 16 cards are matched, update modal and restart game
function win() {
	markCards++;

	if (markCards === 8) {
		starsCount = document.getElementsByClassName('stars-color').length;
		plural = starsCount === 1 ? '' : 's';
		modal.querySelector('.win-text').innerHTML = `With ${moves} moves and ${starsCount} star${plural}! <span class="block">Your time was ${minutes}:${seconds}</span>`;
		setTimeout(function(){
			modal.querySelector('.check').classList.add('animated', 'flip');
			setTimeout(function(){
				modal.querySelector('.check').classList.remove('animated', 'flip');
			}, 500);
			modal.style.display = 'block';
			restartGame();
		}, 500);
	}
}

// give star rating to the game
function starRating() {
	if (moves === 12) {
		stars[2].classList.remove('stars-color');
	} else if (moves === 20) {
		stars[1].classList.remove('stars-color');
	}
}

// reset stars
function resetStars() {
	for (const star of stars) {
		star.classList.add('stars-color');
	}
}

// timer() to count game time
function timer() {
	startTimer = window.setInterval(function(){
		s = s + 1;
		minutes = Math.floor(s / 60);
		seconds = s - minutes * 60;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		timerSelect.textContent = 'Time: ' + minutes + ':' + seconds;
	}, 1000);
}

// Stop timer
function stopTimer(){
	clearInterval(startTimer);
	timerSelect.textContent = 'Time: 00:00';
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create new deck on load
newDeck();
