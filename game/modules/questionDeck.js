const DeckClass = require("./deck");
const questionCards = require("../cards/questionCards");

class QuestionsDeck extends DeckClass{
    constructor(){
        super(questionCards);
    }
}

module.exports = QuestionsDeck;