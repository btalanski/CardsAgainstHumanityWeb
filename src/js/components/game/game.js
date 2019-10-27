import { h, render, Component } from "preact";
import { PlayerDeck } from "../playerDeck";
import { VoteDeck } from "../voteDeck";
import { GAME_STATE } from "../../constants";
import { RoundQuestion } from "../roundQuestion";
import { Box } from "../box";

export class Game extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            {this.renderNextTurnAlert()}
            {this.renderRoundQuestion()}
            {this.renderPlayerDeck()}
            {this.renderVoteDeck()}
        </div>
    }

    renderRoundQuestion = () => {
        const { playerState, gameState } = this.props;
        const { roundQuestion, state } = gameState;
        const props = {
            roundQuestion,
        }

        const shouldRender = state !== GAME_STATE.NEXT_ROUND;

        return shouldRender ? <RoundQuestion {...props}></RoundQuestion> : null;
    }

    renderPlayerDeck = () => {
        const { playerState, gameState, onSelectCard, roundCardSelected } = this.props;
        const { cards } = playerState;
        const { state, roundTimer, roundQuestion } = gameState;

        if (state === GAME_STATE.ROUND_START && !roundCardSelected) {
            return <div>
                <Box>
                    <h1>Selecione <b>{roundQuestion.pick}</b> carta.</h1>
                    <p>{roundTimer}</p>
                </Box>
                <PlayerDeck {...{ cards, onSelect: onSelectCard }}></PlayerDeck>
            </div>;
        }

        return null;
    }

    renderVoteDeck = () => {
        const { playerState, gameState, onSelectCard, roundCardSelected } = this.props;
        const { state, roundSelectedCards, roundTimer } = gameState;

        const shouldRender = state === GAME_STATE.ROUND_VOTE || state === GAME_STATE.ROUND_VOTE_RESULT || roundCardSelected;

        if (shouldRender) {
            const props = {
                cards: roundSelectedCards,
                onSelect: state === GAME_STATE.ROUND_VOTE ? onSelectCard : null,
            }
            const msgs = {};
            msgs[GAME_STATE.ROUND_VOTE] = "Selecione a melhor resposta.";
            msgs[GAME_STATE.ROUND_VOTE_RESULT] = "[#], venceu está rodada!";

            const msg = msgs[state] ? msgs[state] : "Aguardando os outros jogadores.";

            return <div>
                <Box>
                    <h1>{msg}</h1>
                    {roundTimer && GAME_STATE.ROUND_VOTE ? <p>{roundTimer}</p> : null}
                </Box>
                <VoteDeck {...props}></VoteDeck>
            </div>;
        }
        return null;
    }

    renderNextTurnAlert = () => {
        const { gameState: { state, roundTimer } } = this.props;

        if (state === GAME_STATE.NEXT_ROUND) {
            return <Box>
                <h1 class="title is-3">Iniciando nova rodada em <b>{roundTimer}</b></h1>
            </Box>
        }

        return null;
    }
}