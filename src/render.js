import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './js/components/App'
import rendersnap from './rendersnaps'
import divisions from './assets/votesNew.json' 

export async function render() {

    // try {
    //     await rendersnap(divisions);
    // }
    // catch (err) {
    //     console.log(err);
    // }

    // const html = ReactDOMServer.renderToString(<App divisions={divisions}></App>); 
    
    // return `<div id="interactive-wrapper" class="interactive-wrapper">${html}</div>`

    return `<div class="interactive"></div>`;
}