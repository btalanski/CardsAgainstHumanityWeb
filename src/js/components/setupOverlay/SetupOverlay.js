import { h, render } from "preact";
import { Overlay } from "../overlay";

export const SetupOverlay = ({ isVisible, onClose }) => {
    return <Overlay {...{ isVisible, onClose }}>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Criar nova partida</p>
            </header>
            <section class="modal-card-body">
                <form>
                    <div class="field">
                        <label class="label">Nome da sala</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="" />
                        </div>
                    </div>
                    <button class="button is-success">Criar!</button>
                </form>
            </section>
            <footer class="modal-card-foot">
            </footer>
        </div>
    </Overlay>
}