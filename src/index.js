import "./scss/index.scss";

import { h, render, Component } from 'preact';

class App extends Component {
  render() {
    return <h1>Hey</h1>;
  }
}

render(<App />, document.getElementById("app"));