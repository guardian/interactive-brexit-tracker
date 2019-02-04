import React from 'react'
import ReactDOM from 'react-dom'
import Table  from './components/Table'
import divisions from '../assets/votesNew.json'

ReactDOM.render(<Table hasAmendments={divisions.hasAmendments} members={divisions.membersInfo.map(d => {
    d.allText = `${d.name} ${d.constituency} ${d.party}`.toLowerCase()
    return d
})} />, document.getElementById("gv-mp-table"))
