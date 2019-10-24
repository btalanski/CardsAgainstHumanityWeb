import { h, render } from "preact";
import { Overlay } from "../overlay";
import { UserForm } from "./form";

export const SetupOverlay = ({ isVisible, onSubmit }) => {
    return <Overlay {...{ isVisible, allowClose: false, }}>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Entrar na partida.</p>
            </header>
            <section class="modal-card-body">
                <UserForm onSubmit={onSubmit} ></UserForm>
            </section>
            <footer class="modal-card-foot">
            </footer>
        </div>
    </Overlay>
}