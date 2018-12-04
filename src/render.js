
import templateHTML from "./src/templates/main.html!text"
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Snap from './js/components/Snap.js'
import fs from "fs";
import mkdirp from 'mkdirp-sync';

async function rendersnap() {

    await mkdirp('./.build/snap/')

    var snaphtml = ReactDOMServer.renderToString(
        <Snap/>
    )
    await fs.writeFileSync('./.build/snap/rawsnap.html',snaphtml,{flags: 'w'})
    var snapobject = {
        "html" : snaphtml,
        "previoius" : '',
        "refreshStatus" : false,
        "url" : "http://gu.com/",
        "headline" : "Brexit vote Dec 2018",
        "trailText" : "Brexit vote Dec 2018" 
    }
    await fs.writeFileSync('./.build/snap/snap.json',JSON.stringify(snapobject))

    return '';
} 

export async function render() {

    await rendersnap()

    return templateHTML;
}