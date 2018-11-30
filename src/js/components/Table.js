import React, { Component } from 'react'
import Member from './Member.js'


export default class Table extends Component {
    constructor(props) {
      super(props)
    }
  
    render() {


        const divisions = this.props.divisions;
        const members = divisions.membersInfo;

        var memberlist = []
        members.map(m => {
          var memberentry = <Member member={m}/>
          memberlist.push(memberentry)
        })
        console.log(memberlist);

      return (
        <div className='gv-bbv-table'>{memberlist}
        </div>
      )
    }
  }