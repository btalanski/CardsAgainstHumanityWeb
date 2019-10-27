const shuffle = require('lodash/shuffle');

class Deck {
    constructor(cards = []) {
        this.cards = cards;
        this.shuffle();
    }

    shuffle(){
        this.cards = shuffle(this.cards);
    }

    pullCard(total) {
        return this.cards.reduce((hand, card, i) => {
            if (i <= total - 1) {
                const selectedCard = this.cards.pop();
                hand.push(selectedCard);
            }
            return hand;
        }, []);
    }
}

module.exports = Deck;