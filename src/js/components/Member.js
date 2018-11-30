import React, { Component } from 'react'

function prettyVoteName (vote) {
	if (vote == "AyeVote") {return "For"} 
	else if (vote == "NoVote") {return "Against"}
	else {return "Did not vote"} 
}


export default class Table extends Component {
    constructor(props) {
      super(props)
    }
  
    render() {

        const member = this.props.member
       
        member.votes.map(v => {v.prettyvote = prettyVoteName(v.vote)})


      return (
        <div className='gv-member' key={member.id}>
        <div className="gv-member-name gv-cell">{member.name}</div>
        <div className="gv-member-party gv-cell">{member.party}</div>
        <div className="gv-member-constituency gv-cell">{member.constituency}</div>
        <div className="gv-member-vote gv-cell">{member.votes[0].prettyvote}</div>

        </div>
      )
    }
  }