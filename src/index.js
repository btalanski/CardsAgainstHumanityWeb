import "./scss/index.scss";

import { h, render, Component } from 'preact';
import io from 'socket.io-client';
import {
    Chat,
    PlayersList,
    Debugger,
    Overlay,
    PlayerDeck,
} from "./js/components";

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
        gameState: {},
        gameStateLoaded: true,
        playerState: {},
        playersState: [],
        chatState: {},
        showDebug: true,
        chatActive: false,
        showSetupOverlay: true,
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
            {this.renderSetupOverlay()}
            <div class={`column is-one-fifth sidebar ${state.chatActive ? "" : "minimized"}`}>
                {this.renderChat()}
            </div>
            <div class="column main">
                <div class="title-bar">
                    <button onClick={this.toggleChat}>Chat</button>
                    <h1 class="title is-4">Cards against Humanity</h1>
                </div>
                {this.renderPlayersList()}
                {this.renderDebugger()}
                <PlayerDeck />
            </div>
        </div>
    }

    renderPlayersList = () => {
        const { gameStateLoaded = false } = this.state;

        if (gameStateLoaded) {
            const { gameState: { players = [] } } = this.state;
            return <PlayersList {...players} />
        }
        return null;
    }

    renderChat = () => {
        const { gameStateLoaded = false, chatActive = false } = this.state;
        if (gameStateLoaded && chatActive) {
            const { chatState: { log = [] } } = this.state;
            return <Chat {...log} />;
        }
        return null;
    }

    renderDebugger = () => {
        const { showDebug } = this.state;
        return showDebug ? <Debugger {...this.state} /> : null;
    }

    renderSetupOverlay = () => {
        const { showSetupOverlay = false } = this.state;
        return <Overlay isVisible={showSetupOverlay} onClose={this.closeSetupModal}>Teste</Overlay>
    }

    toggleChat = () => {
        this.setState({ chatActive: !this.state.chatActive })
    }

    closeSetupModal = () => {
        this.setState({ showSetupOverlay: false });
    }
}

render(<App />, document.getElementById("app"));