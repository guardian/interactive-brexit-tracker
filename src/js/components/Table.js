import React, { Component } from 'react'
import Member from './Member.js'
import Search from './Search.js'
import ErrorBoundary from './ErrorBoundary.js'

export default class Table extends Component {
    constructor(props) {
      super(props)
    }
  
    render() {


        const divisions = this.props.divisions;
        const members = divisions.membersInfo;

        var memberlist = []
        members.map(m => {
          var memberentry = <Member member={m} key={m.id}/>
          memberlist.push(memberentry)
        })

      return (
      <div className='gv-bbv-table'>
        
        <div className='gv-search'>
        <ErrorBoundary>
        <Search/>
        </ErrorBoundary>
        </div>
        <div className="gv-table-results">{memberlist}</div>
        </div>
      );
    
    };

    handleChange(e) {
if (e.stateText) {console.log(e.stateText)}
    }
  }