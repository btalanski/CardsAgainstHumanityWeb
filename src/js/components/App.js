import { h, render, Component } from 'preact';

import { Chat } from "./chat";
import { PlayersList } from "./playersList";
import { Debugger } from "./debugger";
import { SetupOverlay } from "./setupOverlay";
import { PlayerDeck } from "./playersList";
import { Title, TitleBar } from "./titleBar";
import { SocketContext } from "./socketContext";

export class Main extends Component {
    constructor(props) {
        super(props);
        this.state = this.defaultState;

        this.socket.on('game_data', ({ gameState, chatState }) => {
            console.log("game_data", gameState);
            this.setState((state) => {
                const { gameSetup } = gameState;
                return {
                    ...state,
                    gameState,
                    chatState,
                    gameStateLoaded: true,
                    showSetupOverlay: !gameSetup,
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

    socket = this.props.socket;

    defaultState = {
        gameState: {},
        gameStateLoaded: true,
        playerState: {},
        playersState: [],
        chatState: {},
        showDebug: true,
        chatActive: false,
        showSetupOverlay: false,
    }

    sendUserData = () => {
        this.socket.emit('player_join', {
            nickName: "Bruno"
        });
    }

    componentDidMount() {
        this.sendUserData();
    }

    render(props, state) {
        return <div class="app">
            <TitleBar><Title size="4">Cards Against Humanity</Title></TitleBar>
            {this.renderSetupOverlay()}
            {this.renderPlayersList()}
            {this.renderDebugger()}
        </div>
    }

    renderPlayersList = () => {
        const { gameStateLoaded = false } = this.state;

        if (gameStateLoaded) {
            const { gameState: { players = [] } } = this.state;
            return <PlayersList players={players} />
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
        return showDebug ? <Debugger data={this.state} /> : null;
    }

    renderSetupOverlay = () => {
        const { showSetupOverlay } = this.state;
        return <SetupOverlay isVisible={showSetupOverlay} onClose={this.closeSetupModal} />;
    }

    toggleChat = () => {
        this.setState({ chatActive: !this.state.chatActive })
    }

    closeSetupModal = () => {
        this.setState({ showSetupOverlay: false });
    }
}

export const App = () => {
    return <SocketContext.Consumer>
        {socket => <Main socket={socket} />}
    </SocketContext.Consumer>
}