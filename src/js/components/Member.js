import React, { Component } from 'react'
import VoteList from './VoteList.js'

function prettyVoteName (vote) {
	if (vote == "AyeVote") {return "For"} 
	else if (vote == "NoVote") {return "Against"}
	else {return "Did not vote"} 
}


export default class Member extends Component {
    constructor(props) {
      super(props)
      this.state = {
        selected: false,
        x: 0,
        y: 0
      }
    }


  
    render() {

      const handleMemberClick = this.props.handleMemberClick;

        const member = this.props.member
       
        member.votes.map(v => {v.prettyvote = prettyVoteName(v.vote)})
        member.votes.mainvote = member.votes.find(v => v.isMainVote == true)


      return (
        <div className="gv-member gv-table-row-group">
        <div className="gv-summary-row gv-table-row" onClick={(e) => {handleMemberClick(e,member)}}>
        <div className="gv-member-party gv-cell">{member.party}</div>
        <div className="gv-member-name gv-cell">{member.name}</div>
        <div className="gv-member-constituency gv-cell">{member.constituency}</div>
        <div className="gv-member-vote gv-cell">{member.votes.mainvote.prettyvote}</div>
        </div>
        {this.state.selected && 
        <VoteList votes={member.votes}/>
        }
                </div>
      )
    }
  }