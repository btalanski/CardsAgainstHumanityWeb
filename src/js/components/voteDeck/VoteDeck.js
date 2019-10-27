import { h, render } from 'preact';

const renderCard = ({ value, playerId: id }, playerId, allowCb, cb, idx) => {
    const isPlayerCard = id === playerId;
    const className = `deckCard ${isPlayerCard ? "disabled" : ""}`;
    const key = `card_${id}_${idx}`;
    const props = { key, className };

    if (!isPlayerCard && allowCb) {
        props.onClick = () => cb(id)
    }

    return <div {...props}>{value}</div>;
}

export const VoteDeck = ({ cards = [], playerId = "", onSelect = () => null, allowVote }) => {
    return <div class="flex-wrapper">
        <div class="deck">
            {cards.map((card, i) => renderCard(card, playerId, allowVote, onSelect, i))}
        </div>
    </div>;
}