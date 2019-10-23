import {h, render} from "preact";

export const renderPlayers = (players) => {
    const list = players.map(({ nickName = "", portrait = "" }) =>
        (<li>
            <img src={portrait} alt={`${{ nickName }}_avatar`} />
            <span>{nickName}</span>
        </li>)
    );
    return <ul>{list}</ul>
}

export const PlayersList = ({ players = [] }) => {
    return <div class="players">
        {renderPlayers(players)}
    </div>
}