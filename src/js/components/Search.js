import React, { Component } from 'react'


export default class Search extends Component {
    constructor(props) {
      super(props)

      this.handleChange = this.handleChange.bind(this);

      this.state = {value: ''}


    }
  
    render() {

      
 

      return (
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      )
    }

    handleChange(e) {
        console.log(e)
    }

    componentDidCatch(error,info) {
        console.log(error)
    }
  }