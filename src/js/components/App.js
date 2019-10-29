import { h, render, Component } from 'preact';

import { Chat } from "./chat";
import { PlayersList } from "./playersList";
import { Debugger } from "./debugger";
import { SetupOverlay } from "./setupOverlay";
import { Title, TitleBar } from "./titleBar";
import { WaitingScreen } from "./waitingScreen";
import { Game } from "./game";
import { Box } from "./box";
import { SocketContext } from "./socketContext";
// import { mockState } from "../utils/mockState.js";
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
        roundCardSelected: false,
        roundVoteSubmitted: false,
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
            const { state } = gameState;

            this.setState((prevState) => {
                return {
                    gameState,
                    playerState: player,
                    playersState: otherPlayers,
                    gameStateLoaded: true,
                    roundCardSelected: state === GAME_STATE.NEXT_ROUND ? false : prevState.roundCardSelected,
                    roundVoteSubmitted: state === GAME_STATE.NEXT_ROUND ? false : prevState.roundVoteSubmitted,
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
        return this.state.connected && this.state.gameStateLoaded;
    }

    gameStarted = (state) => {
        return !![
            GAME_STATE.ROUND_SETUP,
            GAME_STATE.ROUND_START,
            GAME_STATE.ROUND_VOTE,
            GAME_STATE.ROUND_VOTE_RESULT,
            GAME_STATE.ROUND_END,
            GAME_STATE.NEXT_ROUND,
        ].find(s => s === state);
    }

    renderPlayersList = () => {
        if (this.gameReady()) {
            const { playersState = [] } = this.state;
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
        const { showSetupOverlay, connected } = this.state;
        return showSetupOverlay && connected
            ? <SetupOverlay isVisible={true} onSubmit={this.submitPlayerInfo} />
            : null;
    }

    renderWaitingScreen = () => {
        if (this.gameReady()) {
            const { gameState: { state } } = this.state;

            if (state === GAME_STATE.WAITING_FOR_PLAYERS || state === GAME_STATE.WAITING_TO_START) {
                const { gameState: { currentPlayers, minRequiredPlayers }, playerState: { isHost } } = this.state;
                const props = {
                    isHost,
                    currentPlayers,
                    minRequiredPlayers,
                    onStart: this.submitReadyToStart,
                    readyToStart: state === GAME_STATE.WAITING_TO_START,
                };
                return <Box><WaitingScreen {...props}></WaitingScreen></Box>
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
            const { gameState: { state } } = this.state;

            if (this.gameStarted(state)) {
                const { gameState, playerState, roundCardSelected, roundVoteSubmitted } = this.state;

                const props = {
                    gameState,
                    playerState,
                    roundCardSelected: roundCardSelected,
                    onSelectCard: this.roundCardSelectedCallback,
                    roundVoteSubmitted: roundVoteSubmitted,
                    onVoteCard: this.roundVoteCallback,
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
        this.socket.emit(SOCKET_EVENTS.PLAYER_JOIN, data);
        this.setState(() => ({ showSetupOverlay: false }));
    }

    roundCardSelectedCallback = (card) => {
        this.socket.emit(SOCKET_EVENTS.ROUND_CARD_SELECTED, card);
        this.setState(() => ({ roundCardSelected: true }));
    }

    roundVoteCallback = (playerId) => {
        this.socket.emit(SOCKET_EVENTS.ROUND_VOTE, playerId);
        this.setState(() => ({ roundVoteSubmitted: true }));
    }
}

export const App = () => {
    return <SocketContext.Consumer>
        {socket => <Main socket={socket} />}
    </SocketContext.Consumer>
}