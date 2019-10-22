const fastify = require('fastify')({ logger: true });
const path = require('path');
const config = require('config');

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'src'),
});

fastify.get('/', function (req, reply) {
    reply.sendFile('index.html')
});

const start = () => {
    const io = require('socket.io')(fastify.server);
    const game = require('./game/game.js');
    game(io);
    
    fastify.listen(config.get("defaultPort"), function (err, address) {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`server listening on ${address}`);
    });
}

start();