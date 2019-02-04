import React, { Component } from 'react'
import ErrorBoundary from './ErrorBoundary';
import tracker from './../tracker'

export default class Search extends Component {
    constructor(props) {
      super(props)

      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleFocus = this.handleFocus.bind(this);

    }

    handleFocus() {
      tracker('searchBox','focus')
    }

    handleFilterTextChange(e) {
      this.props.onFilterTextChange(e.target.value);
    }
  
  
    render() {
      return (
        <ErrorBoundary>
          <div className='gv-mp-search'>
            <img className='gv-search-icon' src='<%= path %>/assets/search.svg'></img>
            <input placeholder="MP, constituency or party" type="text" value={this.props.filterText} onChange={this.handleFilterTextChange} />
          </div>
        </ErrorBoundary>
      )
    }
  }