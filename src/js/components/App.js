import { h, render, Component } from 'preact';

import { Chat } from "./chat";
import { PlayersList } from "./playersList";
import { Debugger } from "./debugger";
import { SetupOverlay } from "./setupOverlay";
import { PlayerDeck } from "./playerDeck";
import { Title, TitleBar } from "./titleBar";
import { WaitingScreen } from "./waitingScreen";
import { Game } from "./game";
import { SocketContext } from "./socketContext";
import { mockState } from "../utils/mockState.js";
import { SOCKET_EVENTS, GAME_STATE } from "../constants";

export class Main extends Component {
    constructor(props) {
        super(props);
        this.state = this.defaultState;
        // this.state = mockState;
        this.registerListeners();
    }

    socket = this.props.socket;

    defaultState = {
        gameState: null,
        gameStateLoaded: false,
        playerState: null,
        playersState: [],
        showDebug: true,
        showSetupOverlay: true,
        connected: false,
    }

    render(props, state) {
        return <div class="app">
            <TitleBar><Title size="4">Cards Against Humanity</Title></TitleBar>
            {this.renderSetupOverlay()}
            {this.renderPlayersList()}
            {this.renderWaitingScreen()}
            {this.renderGameBoard()}
            {this.renderDebugger()}
        </div>
    }

    registerListeners = () => {
        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log(SOCKET_EVENTS.CONNECT);
            this.setState((state) => {
                return {
                    connected: true,
                };
            });
        });

        this.socket.on(SOCKET_EVENTS.RECONNECT, () => {
            console.log(SOCKET_EVENTS.RECONNECT);
            this.setState((state) => {
                return {
                    connected: true,
                };
            });
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(SOCKET_EVENTS.DISCONNECT);
            this.setState((state) => {
                return {
                    connected: false,
                };
            });
        });

        this.socket.on(SOCKET_EVENTS.GAME_UPDATE, ({ player, otherPlayers, gameState }) => {
            console.log(SOCKET_EVENTS.GAME_UPDATE);
            this.setState(() => {
                return {
                    gameState,
                    playerState: player,
                    playersState: otherPlayers,
                    gameStateLoaded: true,
                };
            })
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

    gameReady = () => {
        const { connected, gameStateLoaded, gameState, showSetupOverlay } = this.state;
        return connected && gameStateLoaded && gameState && !showSetupOverlay;
    }

    gameStarted = (state) => {
        const startedStates = [
            GAME_STATE.ROUND_SETUP,
            GAME_STATE.ROUND_START,
            GAME_STATE.ROUND_VOTE,
            GAME_STATE.ROUND_VOTE_RESULT,
            GAME_STATE.ROUND_END,
            GAME_STATE.NEXT_ROUND,
        ];

        return !!startedStates.find(s => s === state);
    }

    renderPlayersList = () => {
        const { gameStateLoaded = false, playersState = [] } = this.state;
        if (gameStateLoaded && playersState.length > 0) {
            return <PlayersList {...{ players: playersState }} ></PlayersList>
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
        const { showSetupOverlay, connected, gameStateLoaded } = this.state;
        const show = showSetupOverlay && connected && !gameStateLoaded;
        return show
            ? <SetupOverlay isVisible={true} onSubmit={this.submitPlayerInfo} />
            : null;
    }

    renderWaitingScreen = () => {
        if (this.gameReady()) {
            const { gameState, playerState } = this.state;
            const { state } = gameState;

            if (state === GAME_STATE.WAITING_FOR_PLAYERS || state === GAME_STATE.WAITING_TO_START) {
                const { currentPlayers, minRequiredPlayers } = gameState;
                const { isHost } = playerState;

                const props = {
                    currentPlayers,
                    minRequiredPlayers,
                    readyToStart: state === GAME_STATE.WAITING_TO_START,
                    isHost,
                    onStart: this.submitReadyToStart,
                };

                return <WaitingScreen {...props}></WaitingScreen>
            }
        }
        return null;
    }

    submitReadyToStart = (e) => {
        e.preventDefault();
        this.socket.emit(SOCKET_EVENTS.READY_TO_START);
    }

    renderGameBoard = () => {
        if (this.gameReady()) {
            const { connected, gameState, playerState } = this.state;
            const { state } = gameState;

            if (this.gameStarted(state)) {
                const props = {
                    gameState,
                    playerState,
                }
                return <Game {...props}></Game>
            }
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
        this.socket.emit("PLAYER_JOIN", data);
        this.setState(() => ({ showSetupOverlay: false }));
    }
}

export const App = () => {
    return <SocketContext.Consumer>
        {socket => <Main socket={socket} />}
    </SocketContext.Consumer>
}