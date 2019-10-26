const uid = require('uid');
const randomColor = require('randomcolor');
const shuffle = require('lodash/shuffle');
const portraits = require('../consts/portraits');

class Player {
    constructor({ id = null, isHost = false, name = "" }) {
        this.id = id;
        this.name = name;
        this.color = randomColor({ luminosity: "dark" });
        this.portrait = shuffle(portraits, { copy: true })[0];
        this.isHost = isHost;
        this.cards = [];
        this.points = 0;
        this.isConnected = true;
    }

    serializeForUpdate() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            portrait: this.portrait,
            points: this.points,
        }
    }

    serialize(){
        return {
            id: this.id,
            isHost: this.isHost,
            cards: this.cards,
            name: this.name,
        }
    }

}

module.exports = Player;