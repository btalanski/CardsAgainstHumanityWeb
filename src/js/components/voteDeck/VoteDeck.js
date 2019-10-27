import { h, render } from 'preact';

export const VoteDeck = ({ cards = [], onSelect = () => null }) => {
    return <div class="flex-wrapper">
        <div class="deck">
            {cards.map((card, i) => {
                const { value } = card;
                return <div key={i} className="deckCard">{value}</div>;
            })}
        </div>
    </div>;
}