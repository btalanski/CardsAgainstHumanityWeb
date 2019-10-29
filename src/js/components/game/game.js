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
            {this.renderRoundQuestion()}
            {this.renderPlayerDeck()}
            {this.renderVoteDeck()}
            {this.renderNextTurnAlert()}
        </div>
    }

    renderRoundQuestion = () => {
        const { gameState: { roundQuestion, state } } = this.props;
        const props = {
            roundQuestion,
        }
        const shouldRender = [GAME_STATE.ROUND_START, GAME_STATE.ROUND_VOTE, GAME_STATE.NEXT_ROUND].includes(state);
        return shouldRender ? <RoundQuestion {...props}></RoundQuestion> : null;
    }

    renderPlayerDeck = () => {
        const { gameState, roundCardSelected } = this.props;

        if (gameState.state === GAME_STATE.ROUND_START && !roundCardSelected) {
            const {
                onSelectCard,
                playerState: { cards },
                gameState: { roundTimer, roundQuestion },
            } = this.props;
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
        const { gameState: { state }, roundCardSelected } = this.props;

        const shouldRender = state === GAME_STATE.ROUND_VOTE || state === GAME_STATE.ROUND_VOTE_RESULT || roundCardSelected;

        if (shouldRender) {
            const {
                playerState: { id },
                gameState: { roundSelectedCards, roundTimer },
                roundVoteSubmitted,
                onVoteCard,
            } = this.props;

            const props = {
                cards: roundSelectedCards,
                playerId: id,
                onSelect: onVoteCard,
                allowVote: state === GAME_STATE.ROUND_VOTE && !roundVoteSubmitted,
            }
            const msgs = {};
            msgs[GAME_STATE.ROUND_VOTE] = "Selecione a melhor resposta.";
            msgs[GAME_STATE.ROUND_VOTE_RESULT] = "[#], venceu está rodada!";

            const msg = msgs[state] ? msgs[state] : "Aguardando os outros jogadores escolherem.";

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
                <h1 class="title is-3">Iniciando nova rodada em <b>{roundTimer}</b> segundos.</h1>
            </Box>
        }

        return null;
    }
}