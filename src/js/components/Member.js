import React, { Component } from 'react'
import VoteList from './VoteList.js'

function prettyVoteName (vote) {
	if (vote == "AyeVote") {return "For"} 
	else if (vote == "NoVote") {return "Against"}
	else {return "Did not vote"} 
}


function checkForMainVoteRebels(member,vote) {
  var govVote = vote.ayeWithGvt ? 'For' : 'Against';
  if (member.party == 'Conservative' && govVote != vote.prettyvote) {
    return 'Yes'
  } else if (member.party != 'Conservative' && govVote == vote.prettyvote) {
    return 'Yes'
  } else {
    return 'No'
  }
}

// function checkForMainVoteRebels (member,vote) {
//   console.log(member.party,vote.vote,vote.ayeWithGvt)
//   if 
//   if (member.party == "Conservative" && vote.vote == "NoVote" && vote.ayeWithGvt == 'true') {
//     console.log(member.name)
//     return 'Yes';
//   } else if (member.party != "Conservative" && vote.vote == "AyeVote" && vote.ayeWithGvt == true) {
//     return 'Yes';
//   } else {
//     return 'No';
//   }
// }


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

        const member = this.props.member;



       
        member.votes.map(v => {
          v.prettyvote = prettyVoteName(v.vote)
        })
        member.votes.mainvote = member.votes.find(v => v.isMainVote == true)
        if (member.votes.mainvote == undefined) {
          member.votes.mainvote = {
            prettyvote: "TBC"
          }
        }
        member.isMainVoteRebel = checkForMainVoteRebels(member,member.votes.mainvote);
     //   console.log(member);


      return (
        <div className="gv-member gv-table-row-group">
        <div className="gv-summary-row gv-table-row" onClick={(e) => {handleMemberClick(e,member)}}>
        <div className="gv-member-party gv-cell">{member.party}</div>
        <div className="gv-member-name gv-cell">{member.name}</div>
        <div className="gv-member-constituency gv-cell">{member.constituency}</div>
        <div className="gv-member-vote gv-cell">{member.votes.mainvote.prettyvote}</div>
        <div className="gv-member-rebel-status gv-cell">{member.isMainVoteRebel}</div>
       
        </div>
        {this.state.selected && 
        <VoteList votes={member.votes}/>
        }
                </div>
      )
    }
  }