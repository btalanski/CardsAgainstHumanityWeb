import { h, render, Component } from "preact";

export class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nickName: "",
        }
    }

    handleChange = (e) => {
        this.setState({ nickName: e.target.value });
    }

    handleSubmit = (e) => {
        this.props.onSubmit(this.state);
        e.preventDefault();
    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <div class="field">
                <label class="label">Escolha seu apelido</label>
                <div class="control">
                    <input class="input" type="text" placeholder="" value={this.state.nickName} onChange={this.handleChange} maxLength={10} required={true}/>
                </div>
            </div>
            <input class="button is-black" type="submit" value="Entrar!" />
        </form>
    }
}