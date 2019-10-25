import { h, render, Component } from 'preact';

import { Chat } from "./chat";
import { PlayersList } from "./playersList";
import { Debugger } from "./debugger";
import { SetupOverlay } from "./setupOverlay";
import { PlayerDeck } from "./playerDeck";
import { Title, TitleBar } from "./titleBar";
import { SocketContext } from "./socketContext";
import { mockState } from "../utils/mockState.js";

export class Main extends Component {
    constructor(props) {
        super(props);
        // this.state = this.defaultState;
        this.state = mockState;
        this.registerListeners();
    }

    socket = this.props.socket;

    defaultState = {
        gameState: null,
        gameStateLoaded: false,
        playerState: null,
        playersState: [],
        chatState: [],
        showDebug: false,
        showSetupOverlay: false,
    }

    render(props, state) {
        return <div class="app">
            <TitleBar><Title size="4">Cards Against Humanity</Title></TitleBar>
            {this.renderSetupOverlay()}
            {this.renderPlayersList()}
            {this.renderPlayerDeck()}
            {this.renderDebugger()}
        </div>
    }

    registerListeners = () => {
        this.socket.on('initial_game_data', ({ gameState, chatState }) => {
            console.log("initial_game_data", gameState);
            this.setState((state) => {
                return {
                    gameState,
                    chatState,
                    gameStateLoaded: true,
                };
            })
        });

        this.socket.on('player_data', playerState => {
            console.log("player_data", playerState);
            this.setState((state) => {
                return {
                    playerState,
                    gameStateLoaded: true,
                };
            })
        });

        this.socket.on('game_data', gameState => {
            console.log("game_data", gameState);
            this.setState((state) => {
                return {
                    gameState,
                    gameStateLoaded: true,
                };
            })
        });

        this.socket.on('chat_data', (msg) => {
            console.log("chat_data", msg);
            this.setState((state) => {
                const chatState = [...state.chatState, msg];
                return { chatState };
            });
        });

        // this.socket.on('disconnect', (reason) => {
        //     switch (reason) {
        //         // the disconnection was initiated by the server, you need to reconnect manually
        //         case "io server disconnect":
        //         case "io client disconnect":
        //         case "ping timeout":
        //             socket.connect();
        //             break;
        //     }
        // });
    }

    renderPlayersList = () => {
        const { gameStateLoaded = false, gameState } = this.state;
        if (gameStateLoaded && gameState) {
            const { gameState: { players = [] } } = this.state;
            return <PlayersList {...{ players }} ></PlayersList>
        }
        return null;
    }

    renderChat = () => {
        const { gameStateLoaded = false } = this.state;
        if (gameStateLoaded) {
            const { chatState: { log = [] } } = this.state;
            return <Chat {...log} ></Chat>;
        }
        return null;
    }

    renderDebugger = () => {
        const { showDebug } = this.state;
        return showDebug ? <Debugger data={this.state} /> : null;
    }

    renderSetupOverlay = () => {
        const { gameState } = this.state;

        return !gameState
            ? <SetupOverlay isVisible={true} onSubmit={this.submitPlayerInfo} />
            : null;
    }

    renderPlayerDeck = () => {
        const { gameStateLoaded = false } = this.state;

        if (gameStateLoaded) {
            const { cards } = this.state.playerState;
            return <PlayerDeck {...{ cards }}></PlayerDeck>
        }

        return null;
    }

    toggleChat = () => {
        this.setState({ chatActive: !this.state.chatActive })
    }

    closeSetupModal = () => {
        this.setState({ showSetupOverlay: false });
    }

    submitPlayerInfo = (data) => {
        console.log(data);
        this.socket.emit("player_join", data);
    }
}

export const App = () => {
    return <SocketContext.Consumer>
        {socket => <Main socket={socket} />}
    </SocketContext.Consumer>
}