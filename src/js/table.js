import React from 'react'
import Table  from './components/Table'
import divisions from '../assets/votesNew.json'

React.render(<Table hasAmendments={divisions.hasAmendments} members={divisions.membersInfo.map(d => {
    d.allText = `${d.name} ${d.constituency}`.toLowerCase()
    return d
})} />, document.getElementById("gv-mp-table"))
