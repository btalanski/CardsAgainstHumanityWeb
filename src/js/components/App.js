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
        chatState: [],
        showDebug: true,
        showSetupOverlay: true,
        connected: false,
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
        this.socket.on('connect', () => {
            console.log("connected");
            this.setState((state) => {
                return {
                    connected: true,
                };
            })
        });

        this.socket.on('GAME_UPDATE', ({ player, otherPlayers, gameState }) => {
            console.log("GAME_UPDATE");
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
        const { showSetupOverlay, connected } = this.state;

        return showSetupOverlay && connected
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
        this.socket.emit("PLAYER_JOIN", data);
        this.setState(() => ({ showSetupOverlay: false }));
    }
}

export const App = () => {
    return <SocketContext.Consumer>
        {socket => <Main socket={socket} />}
    </SocketContext.Consumer>
}