import React, { Component } from 'react'
import Waffle from './Waffle'
import Table from './Table'
import Amendments from './Amendments'

class App extends Component {
  constructor(props) {
    super(props)

    const divsionId = props.divisions.divisionsInfo.find(d => d.isMainVote).id
    
    this.state = {
      members: props.divisions.membersInfo.map(d => ({ id: d.id, party: d.party, vote: d.votes.find(v => v.divisionId === divsionId).vote }))
    }
  }

  render() {
    const divisions = this.props.divisions
    const main = divisions.divisionsInfo.find( o => o.isMainVote )

    console.log(main)

    return (
      <div className='gv-page-wrapper'>
        <Waffle hasData={main.hasData} members={this.state.members} {...main} />
        <Amendments divInfos={divisions.divisionsInfo.filter(d => d.isMainVote === false)} />
        <Table divisions={divisions} />
      </div>
    )
  }
}

export default App