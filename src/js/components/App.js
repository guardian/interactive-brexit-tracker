import React, { Component } from 'react'
import Waffle from './Waffle'
import Table from './Table'
import Amendments from './Amendments'


const divisionNum = 171

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      members: props.divisions.membersInfo.map(d => ({ id: d.id, party: d.party, vote: d.votes.find(v => v.divisionNumber === divisionNum ).vote }))
    }
  }

  render() {
    const divisions = this.props.divisions

    return (
      <div className='gv-page-wrapper'>
        <Waffle members={this.state.members} />
        <Amendments divInfos={divisions.divisionsInfo.filter(d => d.isMainVote === false)} />
        <Table divisions={divisions} />
      </div>
    )
  }
}

export default App