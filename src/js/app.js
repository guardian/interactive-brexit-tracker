import React from 'react'
import { hydrate } from 'react-dom'
import App from './components/App'
import divisions from './../assets/votesNew.json' 

hydrate(<App divisions={divisions} />, document.getElementById("interactive-wrapper"))
