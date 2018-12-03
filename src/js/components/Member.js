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
        selected: false
      }
     this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
  this.state.selected == true ? this.setState({selected: false}) : this.setState({selected: true});
console.log(this.state)
    }

  
    render() {

        const member = this.props.member
       
        member.votes.map(v => {v.prettyvote = prettyVoteName(v.vote)})
        member.votes.mainvote = member.votes.find(v => v.isMainVote == true)


      return (
        <div className='gv-member' key={member.id} onClick={this.handleClick}>
        <div className="gv-summary-row">
        <div className="gv-member-name gv-cell">{member.name}</div>
        <div className="gv-member-party gv-cell">{member.party}</div>
        <div className="gv-member-constituency gv-cell">{member.constituency}</div>
        <div className="gv-member-vote gv-cell">{member.votes.mainvote.prettyvote}</div>
        </div>
        <div className={this.state.selected ? 'expanded': 'collapsed'}>
        <VoteList votes={member.votes} key={member.id}></VoteList>
        </div>
        </div>
      )
    }
  }