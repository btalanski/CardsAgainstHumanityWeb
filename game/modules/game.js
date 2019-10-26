const CONSTANTS = require("../consts");
const PlayerClass = require("./player");

class Game {
    constructor() {
        this.sockets = {}
        this.players = {};
        this.playersWaiting = {};
        this.gameState = CONSTANTS.GAME_STATES.IDLE;
        this.maxAllowedPlayers = 8;
        this.currentPlayers = 0;
        this.defaultTurnTimeoutSeconds = 60;
        this.defaultTimeoutSeconds = 5;
        this.maxNumberOfRounds = null;
        this.roundsCount = null;
        this.roundQuestion = null;
        this.roundSelectedCards = null;
        this.shouldSendUpdate = false;
        // Start game loop
        this.loop = setInterval(() => this.update(), 1000 / 60);
    }

    update() {
        // console.log("Game tick ", Date.now());
        const hasPlayers = Object.keys(this.sockets).length > 0;

        if (hasPlayers && this.gameState === CONSTANTS.GAME_STATES.IDLE) {
            this.gameState = CONSTANTS.GAME_STATES.WAITING_FOR_PLAYERS;
        }

        if (this.gameState === CONSTANTS.GAME_STATES.IDLE) {
            return;
        }

        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                socket.emit(
                    CONSTANTS.SOCKET_EVENTS.GAME_UPTATE,
                    this.createUpdate(player),
                );
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    addPlayer(socket, { nickName = "" }) {
        const { id: socketId } = socket;
        const hasPlayers = Object.keys(this.sockets).length > 0;
        this.sockets[socketId] = socket;
        this.players[socketId] = new PlayerClass({ id: socketId, isHost: !hasPlayers, name: nickName });
    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
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
            }
        };
    }
}

module.exports = Game;