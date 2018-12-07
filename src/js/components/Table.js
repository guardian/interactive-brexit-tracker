import React, { Component } from 'react'
import Search from './Search.js'
import ErrorBoundary from './ErrorBoundary.js'
import TableList from './TableList.js'
import Details from './Details.js'

var member;



export default class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filterText: '',
        sortConditions: {
        },
        details : {
          closed : true,
          member: {},
          x: 0,
          y : 0
        },
        expandedMps: []
      }
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleMemberClick = this.handleMemberClick.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.newHandleClick = this.newHandleClick.bind(this);

    }

    handleClose(e) {
      var newState = Object.assign({},this.state)
      newState.details = {
        closed: true,
        member : {},
        x: 0,
        y: 0
      }
      this.setState(newState)



    }

    handleMemberClick(e,member) {
          var newState = Object.assign({},this.state)
          newState.details = {
            closed: false,
            member : member,
            x: e.pageX,
            y: e.pageY
          }
          this.setState(newState)
        }
    

    handleClick(e,column) {
      var newState = Object.assign({},this.state);
      newState.sortConditions.column = column;
      if (newState.sortConditions.direction == 'up') {
        newState.sortConditions.direction = 'down'
      } else {newState.sortConditions.direction = 'up'}
      this.setState(newState);
    }

    handleFilterTextChange(filterText) {
      this.setState({
        filterText: filterText
      });
    }
  
    newHandleClick(mpId) {
      const ids = [...this.state.expandedMps]
      const index = ids.indexOf(mpId)

      if (index > -1) {
        ids.splice(index, 1);
        this.setState({ expandedMps: ids });
      } else {
        this.setState({ expandedMps: [...this.state.expandedMps, mpId] })
      }
    }

    render() {
      
      const divisions = this.props.divisions;
      const membersInfo = divisions.membersInfo
      const { expandedMps } = this.state

<<<<<<< HEAD
      return(
        <div className="int-table">
          <div className="int-row int-row--header">
            <div className="int-cell">Party</div>
            <div className="int-cell">Name</div>
            <div className="int-cell">Constituency</div>
            <div className="int-cell int-cell--vote ">Y/N?</div>
          </div>
          {membersInfo.map((member, i) =>
              [
                <div key={`member-row-${i}`} className="int-row int-row--mp" onClick={() => this.newHandleClick(member.id)}>
                  <div className="int-cell int-color--{{shortParty}}">{member.party.substring(0, 3)}</div>
                  <div className="int-cell">{member.name}</div>
                  <div className="int-cell">{member.constituency}</div>
                  <div className="int-cell int-cell--vote int-cell--vote-{{value}}">{member.votes[0].vote}</div>
              </div>,
              <div key={`member-drawer-${i}`}>{
                expandedMps.indexOf(member.id) > -1 && <div>all the info</div>
              }</div>
            ]
          )}
=======

      return (
      <div className='gv-bbv-table'>
        
        <div className='gv-search'>
        <Search filterText={this.state.filterText}   onFilterTextChange={this.handleFilterTextChange}/>
        </div>
        <div className="gv-bbv-inner-table">
        <div className="gv-table-header-group">
      <div className="gv-table-header gv-name gv-cell" onClick={e => this.handleClick(e,'listAs')}>Name</div>
      <div className="gv-table-header gv-party gv-cell" onClick={e => this.handleClick(e,'party')}>Party</div>
      <div className="gv-table-header gv-constituency gv-cell" onClick={e => this.handleClick(e,'constituency')}>Constituency</div>
      <div className="gv-table-header gv-vote gv-cell">Main vote</div>
      <div className="gv-table-header gv-member-rebel-status gv-cell" onClick={e => this.handleClick(e,'isMainVoteRebel')}>Rebel?</div>
 
     </div>
        <TableList members={membersInfo} filterText={this.state.filterText} sortConditions={this.state.sortConditions} handleMemberClick={this.handleMemberClick}/>
>>>>>>> 12b7fc12124cc28ae01d5f526c871e77c15f3eb4
        </div>
      )
      
    
    };

  }