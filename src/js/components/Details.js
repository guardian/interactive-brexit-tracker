import React, { Component } from 'react'
import VoteList from './VoteList.js'


export default class Search extends Component {
    constructor(props) {
      super(props)


    }
  
    render() {

      var y = this.props.deets.y
      var adjustedy = y + 10;
      var handleClose = this.props.handleClose;
 

      return (
          
          <div className={`gv-details ${(this.props.deets.closed == true ? 'gv-collapsed' : 'gv-expanded')}`} style={{top: adjustedy}}>
          <button className="gv-details-close" onClick={e => {handleClose(e)}}>X</button>
          {y > 0 &&
          <VoteList votes={this.props.deets.member.votes}></VoteList>
          }
          </div>
      )
    }
  }