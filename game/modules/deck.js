const answerCards = require("../cards/answerCards");
const questionCards = require("../cards/questionCards");
const shuffle = require('lodash/shuffle');
const take = require('lodash/take');

class Deck {
    constructor() {
        this.questionCards = shuffle([...questionCards]);
        this.answerCards = shuffle([...answerCards]);
    }

    pullQuestion() {

    }

    pullCards(total) {
        return this.answerCards.reduce((hand, card, i) => {
            if (i <= total) {
                const selectedCard = this.answerCards.pop();
                hand.push(selectedCard);
            }
            return hand;
        }, []);
    }
}

module.exports = Deck;