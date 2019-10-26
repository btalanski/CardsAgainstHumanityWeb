const answerCards = require("../cards/answerCards");
const questionCards = require("../cards/questionCards");
const shuffle = require('lodash/shuffle');
const take = require('lodash/take');

class Deck {
    constructor() {
        this.questionCards = shuffle([...questionCards]);
        this.answerCards = shuffle([...answerCards]);
    }

    pullQuestion = () => {

    }

    pullAnswer = (total) => {

    }
}

module.exports = Deck;