import { h, render, Component } from "preact";

export class Overlay extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.onMount();
    }

    render({ children, isVisible, allowClose = true }) {

        if (isVisible) {
            return <div class="modal is-active app-modal">
                <div class="modal-background" onClick={this.onClose}></div>
                {children}
                {allowClose && <button class="modal-close is-large" aria-label="close" onClick={this.onClose}></button>}
            </div>
        }

        return null;
    }

    componentWillUnmount(){
        this.$html.classList.remove("is-clipped");
    }

    $html = document.getElementsByTagName("html")[0];

    onMount = () => {
        this.$html.classList.add("is-clipped");
    }

    onClose = () => {
        const { onClose = () => null, allowClose } = this.props;

        if (allowClose) {
            this.$html.classList.remove("is-clipped");
            onClose();
        }
    }
}