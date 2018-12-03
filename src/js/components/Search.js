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
        <input type="text" value={this.props.filterText} onChange={this.handleFilterTextChange} />
        </ErrorBoundary>
      )
    }
  }