import { h, render, Component } from "preact";

export class Overlay extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.onMount();
    }

    render({ children, isVisible }) {

        if (isVisible) {
            return <div class="modal is-active">
                <div class="modal-background" onClick={this.onClose}></div>
                {children}
                <button class="modal-close is-large" aria-label="close" onClick={this.onClose}></button>
            </div>
        }

        return null;
    }

    $html = document.getElementsByTagName("html")[0];

    onMount = () => {
        this.$html.classList.add("is-clipped");
    }

    onClose = () => {
        const { onClose = () => null } = this.props;
        this.$html.classList.remove("is-clipped");
        onClose();
    }
}