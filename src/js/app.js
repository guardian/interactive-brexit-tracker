import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import axios from 'axios'
import divisions from './../assets/votesNew.json' 

const glossesUrl = "https://interactive.guim.co.uk/docsdata-test/1TvMfmTvlemRxZ-OST9e7CyeSIul7ATmAew9FTVwYczU.json"

async function render() {

  axios.get(glossesUrl).then(response => {
    // var glosses = response.data.sheets.Sheet1;

    // divisions.divisionsInfo.map(d => {
    //     var matchingGloss = glosses.find(g => g.divisionId == d.number);
    //     if (matchingGloss != undefined && matchingGloss != "undefined") {
    //       d.glossText = matchingGloss.amendmentGloss;
    //       d.glossTitle = matchingGloss.amendmentTitle;
    //       d.isMainVote = matchingGloss.isFinalVote == 1 ? true : false;
    //     }
    // });
    // divisions.membersInfo.forEach(m => {
    //   m.votes = m.votes.map(v =>{
    //     var matchingGloss = glosses.find(g => g.divisionId == v.divisionNumber);
    //     if (matchingGloss != undefined && matchingGloss != "undefined") {
    //       v.glossText = matchingGloss.amendmentGloss;
    //       v.glossTitle = matchingGloss.amendmentTitle;
    //       v.isMainVote = matchingGloss.isFinalVote == 1 ? true : false;
    //     }
    //     return v;
    //   })
    // })
    
    ReactDOM.render(
      <App divisions={divisions} />,
      document.getElementById("interactive-wrapper")
      );
      
      
      
    })    

}

render()