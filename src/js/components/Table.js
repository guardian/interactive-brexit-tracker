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
        }
      }
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleMemberClick = this.handleMemberClick.bind(this);
      this.handleClose = this.handleClose.bind(this);

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
  
    render() {
      
      const divisions = this.props.divisions;
      const membersInfo = divisions.membersInfo


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
     </div>
        <TableList members={membersInfo} filterText={this.state.filterText} sortConditions={this.state.sortConditions} handleMemberClick={this.handleMemberClick}/>
        </div>
        <Details deets={this.state.details} handleClose={this.handleClose}></Details>
        </div>
      );
    
    };

  }