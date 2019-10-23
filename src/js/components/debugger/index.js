import {h, render} from "preact";

export const Debugger = ({ data }) => {
    return <pre class="debugger">
        {JSON.stringify(data, null, 2)}
    </pre>
}