import React, { Component } from 'react'
import ErrorBoundary from './ErrorBoundary';


export default class Search extends Component {
    constructor(props) {
      super(props)

      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);

    }

    handleFilterTextChange(e) {
      this.props.onFilterTextChange(e.target.value);
    }
  
  
    render() {

      
 

      return (
        <ErrorBoundary>
          <div className='gv-mp-search'>
            <img className='gv-search-icon' src='<%= path %>/assets/search.svg'></img>
            <input placeholder="Search by MP or Constituency" type="text" value={this.props.filterText} onChange={this.handleFilterTextChange} />
          </div>
        </ErrorBoundary>
      )
    }
  }