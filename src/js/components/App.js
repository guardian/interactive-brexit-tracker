import React, { Component } from 'react'
import Waffle from './Waffle'

const divisionNum = 171

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      members: props.data.membersInfo.map(d => ({ id: d.id, party: d.party, vote: d.votes.find(v => v.divisionNumber === divisionNum ).vote }))
    }
  }

  render() {
    return (
      <div className='gv-page-wrapper'>
        <Waffle members={this.state.members} />
      </div>
    )
  }
}

export default App