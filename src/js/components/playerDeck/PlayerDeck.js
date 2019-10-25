import { h, render } from 'preact';

export const PlayerDeck = ({ cards = [] }) => {
    debugger;
    return <div class="playerDeck">
        <div class="deck">
            {cards.map(({ value }, i) =>
                <div key={i} className="deckCard">{value}</div>
            )}
        </div>
    </div>;
}