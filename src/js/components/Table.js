import React, { Component } from 'react'
import Search from './Search.js'
import ErrorBoundary from './ErrorBoundary.js'
import TableList from './TableList.js'

export default class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filterText: '',
        sortConditions: {}
      }
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  
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
        <TableList members={membersInfo} filterText={this.state.filterText}/>
        </div>
      );
    
    };

  }