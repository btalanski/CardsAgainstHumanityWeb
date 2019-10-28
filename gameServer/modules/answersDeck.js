const DeckClass = require("./deck");
const answerCards = require("../cards/answerCards");

class AnswersDeck extends DeckClass{
    constructor(){
        super(answerCards);
    }
}

module.exports = AnswersDeck;