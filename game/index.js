module.exports = (io) => {
    const Constants = require("./consts");
    const GameClass = require("./modules/game");
    const gameInstance = new GameClass();
    

    io.on(Constants.SOCKET_EVENTS.CONNECTION, function (socket) {
        console.log('user connected to session');

        //When a player joins update players array and emit the game state to all players
        socket.on(Constants.SOCKET_EVENTS.PLAYER_JOIN, (data) => {
            console.log(Constants.SOCKET_EVENTS.PLAYER_JOIN);
            gameInstance.addPlayer(socket, data);
        });

        // On player reconnect
        socket.on(Constants.SOCKET_EVENTS.RECONNECT, (reason) => {
            console.log(Constants.SOCKET_EVENTS.RECONNECT);
            gameInstance.addPlayer(socket);
        });

        // On player disconnect
        socket.on(Constants.SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log(Constants.SOCKET_EVENTS.DISCONNECT);
            gameInstance.removePlayer(socket);
        });

        // On ready to start round
        socket.on(Constants.SOCKET_EVENTS.READY_TO_START, () => {
            console.log(Constants.SOCKET_EVENTS.READY_TO_START);
            gameInstance.setReadyToStart();
        });

        // On round card submitted by player
        socket.on(Constants.SOCKET_EVENTS.ROUND_CARD_SELECTED, (card) => {
            console.log(Constants.SOCKET_EVENTS.READY_TO_START);
            gameInstance.onPlayerSelectedCard(socket, card);
        });
    });
};