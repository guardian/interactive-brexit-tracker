import React, { Component } from 'react'
import Table from './Table'
import Amendments from './Amendments'


export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(divisions)
    const divisions = this.props.divisions

    return (
      <div className='gv-page-wrapper'>
        {/*<Table divisions={divisions} />*/}
        <Amendments divisions={divisions} />
      </div>
    )
  }
}