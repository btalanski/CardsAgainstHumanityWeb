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
}

const defaultPlayerState = {
    nickName: null,
    isOwner: false,
    color: "#000000",
    portrait: null,
    isRoundLeader: false,
    cards: [],
    selectedCards: [],
};

const defaultChatState = {
    chatLog:[],
}

const gameLogic = (io) => {
    io.on('connection', function (socket) {
        console.log('a user connected');
    });
}

module.exports = gameLogic;