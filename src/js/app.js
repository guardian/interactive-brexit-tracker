import React from 'react'
import { hydrat, render } from 'react-dom'
import App from './components/App'
import divisions from './../assets/votesNew.json' 

render(<App divisions={divisions} />, document.getElementById("interactive-wrapper"))
