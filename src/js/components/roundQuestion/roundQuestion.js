import { h, render } from "preact";
import parse from "html-react-parser";

const replaceBlanks = (question = "") => {
    const value = question.replace(/\[\#\]/g, "<span>__________</span>");
    return parse(value);
}
export const RoundQuestion = ({ roundQuestion }) => {
    const { value } = roundQuestion;
    return <div class="flex-wrapper">
        <div class="question">
            <h1 class="title is-1">{replaceBlanks(value)}</h1>
        </div>
    </div>
}