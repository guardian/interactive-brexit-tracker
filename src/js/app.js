import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import axios from 'axios'

async function render() {
  // const resp = await axios.get(`https://interactive.guim.co.uk/docsdata-test/1RPOsSCSg6lz42ToQ2zi9JE2rB9cI1ls4-njSYxda7fY.json`)
  ReactDOM.render(
    <App />,
    document.getElementById("interactive-wrapper")
  );
}

render()