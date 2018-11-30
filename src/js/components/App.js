import React, { Component } from 'react'
import Table from './Table'


export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const divisions = this.props.divisions

    return (
      <div className='gv-page-wrapper'>
      <Table divisions={divisions}/>
      </div>
    )
  }
}