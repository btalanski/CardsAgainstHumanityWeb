import "./scss/index.scss";

import { h, render, Component, createContext } from 'preact';

import { App } from "./js/components/App";
import { SocketContext } from "./js/components/socketContext";

import io from 'socket.io-client';

const socket = io("http://localhost:8080");

const Main = () => {
    return <SocketContext.Provider value={socket}>
        <App />
    </SocketContext.Provider>
}

render(<Main />, document.getElementsByTagName("body")[0]);