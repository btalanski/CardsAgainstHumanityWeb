import "./scss/index.scss";

import { h, render, Component } from 'preact';
import io from 'socket.io-client';

class App extends Component {
    constructor(props) {
        super(props);
        this.socket = io("http://localhost:8080");
        this.state = this.defaultState;

        this.socket.on('game_data', ({ gameState, chatState }) => {
            console.log("game_data", gameState);
            this.setState((state) => {
                return {
                    ...state,
                    gameState,
                    chatState,
                    gameStateLoaded: true,
                };
            })
        });

        this.socket.on('chat_msg', (message) => {
            console.log("game_data", gameState);
            this.setState((state) => {
                return {
                    ...state,
                    chatState: chatState.push(message),
                };
            })
        });
    }

    socket = null;

    defaultState = {
        gameState: null,
        gameStateLoaded: false,
        playerState: null,
        playersState: [],
        chatState: null,
        showDebug: false,
    }

    sendUserData = () => {
        this.socket.emit('player_join', {
            nickName: "Bruno"
        });
    }

    componentDidMount() {
        const $html = document.getElementsByTagName("html")[0];
        const $body = document.getElementsByTagName("body")[0];
        const $app = document.getElementById("app");


        $html.classList.add("h-100");
        $body.classList.add("h-100");
        $app.classList.add("h-100");

        this.sendUserData();
    }
    render(props, state) {
        return <div class="columns h-100 is-gapless">
            <div class="column is-one-fifth sidebar">
                <h1 class="app-title title is-4">Cards against Humanity</h1>
                <div class="container is-fluid">
                    <div>
                        <h1 class="section-title">Jogadores</h1>
                        {this.renderPlayerList()}
                    </div>
                    <div>
                        <h1 class="section-title">Chat</h1>
                        {this.renderChat()}
                    </div>
                </div>
            </div>
            <div class="column content">
                {this.renderDebug()}
            </div>
        </div>
    }

    renderPlayerList = () => {

        const { gameStateLoaded = false } = this.state;

        if (gameStateLoaded) {
            const { gameState: { players = [] } } = this.state;

            const list = players.map(p => {
                const { nickName = "", portrait = "" } = p;
                return <li>
                    <img src={portrait} />
                    <span>{nickName}</span>
                </li>
            });
            return <ul class="playersList">{list}</ul>
        }
        return null;
    }

    renderChat = () => {
        const { gameStateLoaded = false } = this.state;

        if (gameStateLoaded) {
            const { chatState: { log = [] } } = this.state;
            const msgs = log.map(({ from = "", text = "" }) => (<li><b>{from}</b>: {text}</li>))
            const list = <ul>{msgs}</ul>

            return <div class="chatLog">{list}</div>;
        }
        return null;
    }

    renderDebug = () => {
        const { showDebug } = this.state;

        if (showDebug) {
            <pre>
                {JSON.stringify(this.state, null, 2)}
            </pre>
        }

        return null;
    }
}

render(<App />, document.getElementById("app"));