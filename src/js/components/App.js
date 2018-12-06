import React, { Component } from 'react'
import Table from './Table'
import Amendments from './Amendments'


export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const divisions = this.props.divisions

    return (
      <div className='gv-page-wrapper'>
        <Amendments divInfos={divisions.divisionsInfo.filter(d => d.isMainVote === false)} />
        <Table divisions={divisions} />
      </div>
    )
  }
}