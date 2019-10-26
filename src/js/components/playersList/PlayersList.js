import {h, render} from "preact";

export const renderPlayers = (players) => {
    const list = players.map(({ name = "", portrait = "", id = "", points = 0 }) =>
        (<li key={id}>
            <div class="points"><span>{points}</span></div>
            <div class="img-frame">
                <img src={portrait} alt={`${{ name }} avatar`} />
            </div>
            <div class="player-info">
                <span>{name}</span>
            </div>
        </li>)
    );
    return <ul>{list}</ul>
}

export const PlayersList = ({ players = [] }) => {
    return <div class="players">
        {renderPlayers(players)}
    </div>
}