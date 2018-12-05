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
        {/* divinfos in the Amendments needs to be passed already as filtered to only the amendments without the main vote. We're not currently doing that*/}
        <Amendments divInfos={divisions.divisionsInfo} />
        <Table divisions={divisions} />
      </div>
    )
  }
}