import React, { Component } from 'react'
import VoteList from './VoteList.js'


export default class Search extends Component {
    constructor(props) {
      super(props)


    }
  
    render() {

      var y = this.props.deets.y
      var adjustedy = y + 10;
 

      return (
          <div className="gv-details" style={{top: adjustedy}}>I AM THE DETAILS BOX
          {y > 0 &&
          <VoteList votes={this.props.deets.member.votes}></VoteList>
          }
          </div>
      )
    }
  }