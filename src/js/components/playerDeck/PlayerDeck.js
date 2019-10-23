import { h, render } from 'preact';

import TinySlider from "tiny-slider-react";

export const PlayerDeck = () => {
    return <div class="playerDeck">
        <div class="deck">
            {[...Array(50)].map((x, i) =>
                <p key={i} className="deckCard">Some content</p>
            )}
        </div>
    </div>;
}