import { h, render } from "preact";

export const TitleBar = ({ children }) => {
    return <div class="title-bar">{children}</div>
}

export const Title = ({ size = "", children }) => {
    return <h1 class={`title ${!!size ? "is" + size : ""}`}>{children}</h1>
}