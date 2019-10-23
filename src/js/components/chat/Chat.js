import { h, render } from "preact";

export const renderMessages = (msgs) => {
    const chat = msgs.map(({ from = "", text = "", color = "", style = "" }) => (<li><b>{from}</b>: {text}</li>))
    return <ul>{chat}</ul>
}

export const Chat = ({ msgs = [] }) => {
    return <div class="chat">
        <div class="title-bar">
            <h1 class="title is-4">Chat</h1>
        </div>
        <div class="log">
            {renderMessages(msgs)}
        </div>
        <div class="form">
            <form>
                <textarea class="textarea" placeholder="Digite sua mensagem..."></textarea>
                <button class="button is-medium is-fullwidth">Enviar</button>
            </form>
        </div>
    </div>
}