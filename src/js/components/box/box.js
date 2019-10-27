import { h, render } from "preact";

export const Box = ({ children }) => {
    return <div class="flex-wrapper">
        <div class="box">{children}</div>
    </div>
}