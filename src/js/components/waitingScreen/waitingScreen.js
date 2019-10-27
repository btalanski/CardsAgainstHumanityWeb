import { h, render } from "preact";

export const WaitingScreen = ({
    currentPlayers = 0,
    minRequiredPlayers = 0,
    readyToStart = false,
    isHost = false,
    onStart = () => { }
}) => {
    const msg = readyToStart
        ? "Aguardando o líder iniciar a partida"
        : "Aguardando jogadores para iniciar a partida.";
    const isReady = readyToStart && isHost && currentPlayers >= minRequiredPlayers;
    
    return <div class="waiting-screen">
            <h1 class="title is-3">{msg}</h1>
            <p class="title is-4">{`${currentPlayers}/${minRequiredPlayers}`}</p>
            {isReady && <button class="button is-black is-large" onClick={onStart}>Iniciar partida</button>}
        </div>;
}