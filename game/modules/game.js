const CONSTANTS = require("../consts");
const PlayerClass = require("./player");
const AnswersDeck = require("./answersDeck");
const QuestionsDeck = require("./questionDeck");
const PortraitsModel = require("./portraits");

class Game {
    constructor() {
        this.sockets = {}
        this.players = {};
        this.playersWaiting = {};
        this.gameState = CONSTANTS.GAME_STATES.IDLE;
        this.minRequiredPlayers = 2;
        this.maxAllowedPlayers = 8;
        this.currentPlayers = 0;
        this.readyToStart = false;
        this.defaultTurnTimeoutSeconds = 60;
        this.defaultTimeoutSeconds = 5;
        this.defaultRoundTimeInSeconds = 30;
        this.defaultRoundVoteTimeInSeconds = 30;
        this.defaultNextRoundTimeInSeconds = 30;
        this.maxNumberOfRounds = null;
        this.roundsCount = null;
        this.roundQuestion = null;
        this.roundDeck = null;
        this.roundTimer = null;
        this.roundTimerInterval = null;
        this.roundSelectedCards = [];
        this.shouldSendUpdate = false;
        this.portraits = new PortraitsModel();
        // Start game loop
        this.loop = setInterval(() => this.update(), 1000 / 60);
    }

    update() {
        this.currentPlayers = Object.keys(this.players).length;

        if (this.currentPlayers === 0 && this.gameState !== CONSTANTS.GAME_STATES.IDLE) {
            this.resetGameState();
            this.shouldSendUpdate = true;
        }

        if (this.currentPlayers > 0 && this.gameState === CONSTANTS.GAME_STATES.IDLE) {
            this.gameState = CONSTANTS.GAME_STATES.WAITING_FOR_PLAYERS;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.IDLE) {
            this.shouldSendUpdate = false;
            return;
        }

        if (this.currentPlayers >= this.minRequiredPlayers && this.gameState === CONSTANTS.GAME_STATES.WAITING_FOR_PLAYERS) {
            this.gameState = CONSTANTS.GAME_STATES.WAITING_TO_START;
            this.shouldSendUpdate = true;
        }

        if (this.currentPlayers >= this.minRequiredPlayers &&
            this.gameState === CONSTANTS.GAME_STATES.WAITING_TO_START &&
            this.readyToStart) {
            this.gameState = CONSTANTS.GAME_STATES.ROUND_SETUP;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_SETUP) {
            this.setupRound();
            Object.keys(this.players).forEach(playerID => {
                this.players[playerID].cards = this.roundDeck.pullCard(10);
            });
            this.gameState = CONSTANTS.GAME_STATES.ROUND_START;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_START && !this.roundTimerInterval) {
            this.roundTimer = this.defaultRoundTimeInSeconds;
            this.roundTimerInterval = setInterval(() => {
                this.roundTimer--;
                this.shouldSendUpdate = true;
            }, 1000);
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_START &&
            this.roundTimerInterval &&
            this.roundTimer <= 0) {
            this.roundTimer = 0;
            clearInterval(this.roundTimerInterval);
            this.roundTimerInterval = null;
            this.gameState = CONSTANTS.GAME_STATES.ROUND_VOTE;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_VOTE && !this.roundTimerInterval) {
            this.roundTimer = this.defaultRoundVoteTimeInSeconds;
            this.roundTimerInterval = setInterval(() => {
                this.roundTimer--;
                this.shouldSendUpdate = true;
            }, 1000);
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_VOTE &&
            this.roundTimerInterval &&
            this.roundTimer <= 0) {
            this.roundTimer = 0;
            clearInterval(this.roundTimerInterval);
            this.roundTimerInterval = null;
            this.gameState = CONSTANTS.GAME_STATES.ROUND_END;
            this.shouldSendUpdate = true;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.ROUND_END) {
            // Process round result
            // Find round winner
            // Add score to round winner
            this.cleanUpRound();
        }

        if (this.gameState === CONSTANTS.GAME_STATES.NEXT_ROUND && !this.roundTimerInterval) {
            this.roundTimer = this.defaultNextRoundTimeInSeconds;
            this.roundTimerInterval = setInterval(() => {
                this.roundTimer--;
                this.shouldSendUpdate = true;
            }, 1000);
        }

        if (this.gameState === CONSTANTS.GAME_STATES.NEXT_ROUND &&
            this.roundTimerInterval &&
            this.roundTimer <= 0) {
            this.roundTimer = 0;
            clearInterval(this.roundTimerInterval);
            this.roundTimerInterval = null;
            this.gameState = CONSTANTS.GAME_STATES.ROUND_SETUP;
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
        this.players[socketId] = new PlayerClass({ 
            id: socketId,
            isHost: !hasPlayers,
            name: nickName,
            portrait: this.portraits.pop(),
        });
        this.currentPlayers = Object.keys(this.players).length;
        this.shouldSendUpdate = true;
    }

    removePlayer(socket) {
        const player = this.players[socket.id];

        if(player){
            this.portraits.push(player.portrait);
        }

        delete this.sockets[socket.id];
        delete this.players[socket.id];

        this.currentPlayers = Object.keys(this.players).length;
        this.shouldSendUpdate = true;
    }

    setReadyToStart() {
        this.readyToStart = true;
        this.shouldSendUpdate = true;
    }

    resetGameState() {
        this.sockets = {};
        this.players = {};
        this.gameState = CONSTANTS.GAME_STATES.IDLE;
        this.readyToStart = false;
        this.roundsCount = null;
        this.roundQuestion = null;
        this.roundDeck = null;
        this.roundTimer = null;
        clearInterval(this.roundTimerInterval);
        this.roundTimerInterval = null;
        this.roundSelectedCards = [];
    }

    setupRound() {
        this.roundDeck = new AnswersDeck();

        const deck = new QuestionsDeck();
        this.roundQuestion = null;

        do {
            const card = deck.pullCard(1)[0];
            if (card.pick === 1) {
                this.roundQuestion = card;
            }
        } while (!this.roundQuestion);
    }

    cleanUpRound() {
        this.gameState = CONSTANTS.GAME_STATES.NEXT_ROUND;
        // this.roundQuestion = null;
        // this.roundDeck = null;
        // this.roundTimer = null;
        // clearInterval(this.roundTimerInterval);
        // this.roundTimerInterval = null;
        this.roundSelectedCards = [];

        this.shouldSendUpdate = true;
    }

    onPlayerSelectedCard(socket, card) {
        const player = this.players[socket.id];

        const selectedCard = {
            ...card,
            votes: 0,
            playerId: player.id,
            playerName: player.name
        };

        this.roundSelectedCards.push(selectedCard);
        this.shouldSendUpdate = true;
    }

    onPlayerVote(playerId) {
        this.roundSelectedCards = this.roundSelectedCards.map(card => {
            if (card.playerId === playerId) {
                const { votes } = card;
                card.votes = votes + 1;
            }
            return card;
        });
        this.shouldSendUpdate = true;
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
                currentPlayers: this.currentPlayers,
                minRequiredPlayers: this.minRequiredPlayers,
            }
        };
    }
}

module.exports = Game;