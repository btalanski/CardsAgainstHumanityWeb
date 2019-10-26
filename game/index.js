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

        // On player disconnect
        socket.on(Constants.SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log(Constants.SOCKET_EVENTS.DISCONNECT);
            gameInstance.addPlayer(socket);
        });
    });
};