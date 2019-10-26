const CONSTANTS = require("../consts");
const PlayerClass = require("./player");
const DeckClass = require("./deck");

class Game {
    constructor() {
        this.sockets = {}
        this.players = {};
        this.playersWaiting = {};
        this.gameState = CONSTANTS.GAME_STATES.IDLE;
        this.minRequiredPlayers = 3;
        this.maxAllowedPlayers = 8;
        this.currentPlayers = 0;
        this.defaultTurnTimeoutSeconds = 60;
        this.defaultTimeoutSeconds = 5;
        this.defaultRoundTimeInSeconds = 30;
        this.defaultRoundVoteTimeInSeconds = 30;
        this.maxNumberOfRounds = null;
        this.roundsCount = null;
        this.roundQuestion = null;
        this.roundDeck = null;
        this.roundTimer = null;
        this.roundTimerInterval = null;
        this.roundSelectedCards = null;
        this.shouldSendUpdate = false;
        // Start game loop
        this.loop = setInterval(() => this.update(), 1000 / 60);
    }

    update() {
        // console.log("Game tick ", Date.now());
        const currentPlayers = Object.keys(this.sockets).length;

        if (currentPlayers > 0 && this.gameState === CONSTANTS.GAME_STATES.IDLE) {
            this.gameState = CONSTANTS.GAME_STATES.WAITING_FOR_PLAYERS;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.IDLE) {
            return;
        }

        if (currentPlayers >= this.minRequiredPlayers && this.gameState === CONSTANTS.GAME_STATES.WAITING_FOR_PLAYERS) {
            this.gameState = CONSTANTS.GAME_STATES.WAITING_TO_START;
            this.shouldSendUpdate = true;
        }

        if (currentPlayers >= this.minRequiredPlayers && this.gameState === CONSTANTS.GAME_STATES.WAITING_TO_START) {
            this.gameState = CONSTANTS.GAME_STATES.ROUND_SETUP;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_SETUP) {
            this.setupRound();
            Object.keys(this.players).forEach(playerID => {
                this.players[playerID].cards = this.roundDeck.pullCards(10);
            });
            this.gameState = CONSTANTS.GAME_STATES.ROUND_START;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_START && !this.roundTimerInterval) {
            this.roundTimer = 0;
            this.roundTimerInterval = setInterval(() => {
                this.roundTimer++;
                this.shouldSendUpdate = true;
            }, 1000);
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_START &&
            this.roundTimerInterval &&
            this.roundTimer >= this.defaultRoundTimeInSeconds) {
                this.roundTimer = 0;
                clearInterval(this.roundTimerInterval);
                this.roundTimerInterval = null;
                this.gameState = CONSTANTS.GAME_STATES.ROUND_VOTE;
                this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_VOTE && !this.roundTimerInterval) {
            this.roundTimer = 0;
            this.roundTimerInterval = setInterval(() => {
                this.roundTimer++;
                this.shouldSendUpdate = true;
            }, 1000);
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_VOTE &&
            this.roundTimerInterval &&
            this.roundTimer >= this.defaultRoundVoteTimeInSeconds) {
                this.roundTimer = 0;
                clearInterval(this.roundTimerInterval);
                this.roundTimerInterval = null;
                this.gameState = CONSTANTS.GAME_STATES.ROUND_END;
                this.shouldSendUpdate = true;
        }

        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                socket.emit(
                    CONSTANTS.SOCKET_EVENTS.GAME_UPDATE,
                    this.createUpdate(player),
                );
            });
            console.log("game updated ", Date.now());
            this.shouldSendUpdate = false;
        }
        // } else {
        //     this.shouldSendUpdate = true;
        // }
    }

    addPlayer(socket, { nickName = "" }) {
        const { id: socketId } = socket;
        const hasPlayers = Object.keys(this.sockets).length > 0;
        this.sockets[socketId] = socket;
        this.players[socketId] = new PlayerClass({ id: socketId, isHost: !hasPlayers, name: nickName });
        this.shouldSendUpdate = true;
    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        this.shouldSendUpdate = true;
    }

    setupRound() {
        this.roundDeck = new DeckClass();
    }

    createUpdate(player) {
        const otherPlayers = Object.keys(this.players)
            // .filter(playerId => this.players[playerId].id !== player.id)
            .map(playerId => this.players[playerId].serializeForUpdate());

        return {
            player: player.serialize(),
            otherPlayers,
            gameState: {
                state: this.gameState,
                roundQuestion: this.roundQuestion,
                roundSelectedCards: this.roundSelectedCards,
                roundTimer: this.roundTimer,
            }
        };
    }
}

module.exports = Game;