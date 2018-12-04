import React, { Component } from 'react'
import Search from './Search.js'
import ErrorBoundary from './ErrorBoundary.js'
import TableList from './TableList.js'





export default class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filterText: '',
        sortConditions: {
        }
      }
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
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
        <div className="gv-table-header-group">
      <div className="gv-table-header gv-name" onClick={e => this.handleClick(e,'listAs')}>Name</div>
      <div className="gv-table-header gv-party" onClick={e => this.handleClick(e,'party')}>Party</div>
      <div className="gv-table-header gv-constituency" onClick={e => this.handleClick(e,'constituency')}>Constituency</div>
      <div className="gv-table-header gv-vote">Main vote</div>

      </div>

        <TableList members={membersInfo} filterText={this.state.filterText} sortConditions={this.state.sortConditions}/>
        </div>
      );
    
    };

  }