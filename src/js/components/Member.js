import React, { Component } from 'react'
import Member from './Member.js'


export default class Table extends Component {
    constructor(props) {
      super(props)
    }
  
    render() {

        console.log(this.props)
        const member = this.props.member
       
      return (
        <div className='gv-member'>
        <div class="gv-member-name gv-cell">{member.name}</div>
        <div class="gv-member-party gv-cell">{member.party}</div>
        <div class="gv-member-constituency gv-cell">{member.constituency}</div>
        <div class="gv-member-vote gv-cell">{member.votes[0].vote}</div>

        </div>
      )
    }
  }