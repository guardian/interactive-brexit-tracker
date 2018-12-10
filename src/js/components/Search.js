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
        <input type="text" value={this.props.filterText} onChange={this.handleFilterTextChange} onFocus={this.handleFocus}/>
        </ErrorBoundary>
      )
    }
  }