
import templateHTML from "./src/templates/main.html!text"
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Snap from './js/components/Snap.js'
import fs from "fs";
import mkdirp from 'mkdirp-sync';
import divisions from './assets/votesNew.json'
import axios from 'axios'

const glossesUrl = "https://interactive.guim.co.uk/docsdata-test/1TvMfmTvlemRxZ-OST9e7CyeSIul7ATmAew9FTVwYczU.json"


async function finesseData() {

    axios.get(glossesUrl).then(response => {
        var glosses = response.data.sheets.Sheet1;
    
        var newdivisions = Object.assign({},divisions)
        newdivisions.divisionsInfo = divisions.divisionsInfo.map(d => {
            var matchingGloss = glosses.find(g => g.divisionId == d.number);
            if (matchingGloss != undefined && matchingGloss != "undefined") {
              d.glossText = matchingGloss.amendmentGloss;
              d.glossTitle = matchingGloss.amendmentTitle;
              d.isMainVote = matchingGloss.isFinalVote == 1 ? true : false;
            }
        });
        newdivisions.membersInfo = divisions.membersInfo.forEach(m => {
          m.votes = m.votes.map(v =>{
            var matchingGloss = glosses.find(g => g.divisionId == v.divisionNumber);
            if (matchingGloss != undefined && matchingGloss != "undefined") {
              v.glossText = matchingGloss.amendmentGloss;
              v.glossTitle = matchingGloss.amendmentTitle;
              v.isMainVote = matchingGloss.isFinalVote == 1 ? true : false;
            }
            return v;
          })
        })
        return newdivisions;
    })
}

    

async function rendersnap() {

    var glosses = (await axios.get(glossesUrl)).data.sheets.Sheet1
    
        var newdivisions = Object.assign({},divisions)
        newdivisions.divisionsInfo = divisions.divisionsInfo.map(d => {
            var matchingGloss = glosses.find(g => g.divisionId == d.number);
            if (matchingGloss != undefined && matchingGloss != "undefined") {
              d.glossText = matchingGloss.amendmentGloss;
              d.glossTitle = matchingGloss.amendmentTitle;
              d.isMainVote = matchingGloss.isFinalVote == 1 ? true : false;
            }
            return d;
        });
        delete(newdivisions.membersInfo)  
        var maindivision = newdivisions.divisionsInfo.find(d => d.isMainVote == true)
    await mkdirp('./.build/snap/')

    var snaphtml = ReactDOMServer.renderToString(
        <Snap divisions={maindivision}/>
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

    // await rendersnap();

    return templateHTML;
}