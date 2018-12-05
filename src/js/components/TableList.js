import React, { Component } from 'react'
import Member from './Member.js'

export default class TableList extends Component {
    constructor(props) {
      super(props)
      console.log(this.props)
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick(e) {
        console.log('asdfsdf')
        console.log(e.pageX, e.pageY)
    }

    render() {

        var members = this.props.members;
        members = members.map(m => {
            m.allText =  `${m.name} ${m.constituency}`
            return m;
        })
        var showmembers = members;
        if (this.props.sortConditions.column == undefined) {
            var column = 'listAs'} else {
            var column = this.props.sortConditions.column;
            var direction = this.props.sortConditions.direction;
            showmembers = showmembers.sort((a,b) => {
                if (a[column] > b[column]) {return direction == 'up' ? 1 : -1}
                else if (a[column] < b[column]) { return direction == 'up' ? -1 : 1}
                else {return 0}
            })
        }

        var memberlist = []
            showmembers = members.filter(m => m.allText.indexOf(this.props.filterText) > -1);
   
        showmembers.map(m => {
          var memberentry = <Member member={m} key={m.id} handleMemberClick={this.props.handleMemberClick}/>
          memberlist.push(memberentry)
        })


      return (
        memberlist
      );
    
    };

  }