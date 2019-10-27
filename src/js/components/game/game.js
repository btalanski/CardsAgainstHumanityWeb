import { h, render, Component } from "preact";
import { PlayerDeck } from "../playerDeck";
import { GAME_STATE } from "../../constants";
import { RoundQuestion } from "../roundQuestion";

export class Game extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            {this.renderRoundQuestion()}
            {this.renderPlayerDeck()}
        </div>
    }

    renderRoundQuestion = () => {
        const { playerState, gameState } = this.props;
        const { roundQuestion } = gameState;
        const props = {
            roundQuestion,
        }
        return <RoundQuestion {...props}></RoundQuestion>;
    }

    renderPlayerDeck = () => {
        const { playerState, gameState } = this.props;
        const { cards } = playerState;
        const { state } = gameState;
        return state === GAME_STATE.ROUND_START ? <PlayerDeck {...{ cards }}></PlayerDeck> : null;
    }
}