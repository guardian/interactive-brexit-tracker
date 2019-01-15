import React, { Component } from 'react'
import Waffle from './Waffle'
import Table from './Table'
import Amendments from './Amendments'
import PartyKey from './PartyKey'
import { checkForMainVoteRebels } from '../util'

class App extends Component {
  constructor(props) {
    super(props)

    const divsionId = props.divisions.divisionsInfo.find(d => d.isMainVote).id
    
    this.state = {
      members: props.divisions.membersInfo.map(d => { 
        const division = d.votes.find(v => v.divisionId === divsionId)
        return { id: d.id, party: d.party, vote: division ? division.vote : '---', teller: division ? division.teller : false }
      })
    }
  }

  render() {
    const divisions = this.props.divisions
    const main = divisions.divisionsInfo.find( o => o.isMainVote )

    return (
      <div className='gv-page-wrapper'>
        <Waffle hasData={main.hasData} members={this.state.members} {...main} />
        <PartyKey />
        <div className='gv-top-disclaimer'>Tellers are not included in totals, but are included in the graphics and searchable table</div>
        <Amendments divInfos={divisions.divisionsInfo.filter(d => d.isMainVote === false)} manualData={divisions.manualData.filter(d => d.isMainVote === false)} />
        <Table members={divisions.membersInfo.map(d => {
          const mainVote = d.votes.find(v => v.isMainVote === true)
          d.isMainVoteRebel = mainVote ? checkForMainVoteRebels(d, mainVote) : 'TBC'
          d.allText = `${d.name} ${d.constituency}`.toLowerCase()
          return d
      })} />
      </div>
    )
  }
}

export default App