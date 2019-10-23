const whiteDeck = require("./data/wCards");
const blackDeck = require("./data/bCards");
const randomColor = require('randomcolor');

const defaultState = {
    players: [],
    gameName: "",
    matchStarted: false,
    maxAllowedPlayers: 6,
    defaultTurnTimeoutSeconds: 60,
    defaultTimeoutSeconds: 5,
    maxNumberOfRounds: null,
    roundsCount: null,
    questionDeck: [],
    answerDeck: [],
    selectedCard: null,
    enableChat: true,
};

const defaultPlayerState = {
    nickName: null,
    isOwner: false,
    color: "#000000",
    portrait: "https://imgflip.com/s/meme/Conspiracy-Keanu.jpg",
    isRoundLeader: false,
    cards: [],
    selectedCards: [],
    socketId: null,
};

const defaultChatState = {
    log: [
        {
            from: "Server",
            color: "#000000",
            style: "bold",
            text: "Seja bem vindo(a)",
        }
    ],
};

const server = (io) => {

    const gameState = {
        ...defaultState,
        gameName: "Demo",
        maxNumberOfRounds: 5,
        roundsCount: 0,
        questionDeck: blackDeck,
        answerDeck: whiteDeck,
    }

    const chatState = {
        ...defaultChatState,
    }

    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.emit('game_data', { gameState, chatState });

        socket.on('player_join', function (data) {
            console.log("player_join");
            const { nickName } = data;
            const player = {
                ...defaultPlayerState,
                nickName,
                socketId: socket.id,
                color: randomColor({ luminosity: dark }),
            };
            gameState.players.push(player);

            chatState.log.push({
                from: "Server",
                text: `${nickName} entrou na sala.`,
            });

            io.emit('game_data', { gameState, chatState });
        });
    });
};

module.exports = server;