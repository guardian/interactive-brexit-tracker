import React, { Component } from 'react'
import Member from './Member.js'

export default class TableList extends Component {
    constructor(props) {
      super(props)
    }
  
    render() {

        var members = this.props.members;
        members = members.map(m => {
            m.allText =  `${m.name} ${m.constituency}`
            return m;
        })
        var showmembers = members;
        var memberlist = []
        if (this.props.filterText.length > 2) {
            showmembers = members.filter(m => m.allText.indexOf(this.props.filterText) > -1);
        }
        showmembers.map(m => {
          var memberentry = <Member member={m} key={m.id}/>
          memberlist.push(memberentry)
        })

      return (
      <div className='gv-bbv-table-list'>
        
        <div className="gv-table-results">{memberlist}</div>
        </div>
      );
    
    };

  }