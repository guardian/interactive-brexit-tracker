import React, { Component } from 'react'

function prettyVoteName (vote) {
	if (vote == "AyeVote") {return "For"} 
	else if (vote == "NoVote") {return "Against"}
	else {return "Did not vote"} 
}


class Vote extends Component {
    constructor (props ) {
        super(props)
    }

    render() {

        const vote = this.props.vote; 
      return (<div className="gv-vote-item"><div className="gv-vote-item-title">{vote.glossTitle}</div><div className="gv-vote-item-gloss">{vote.glossText}</div><div className="gv-vote-item-decision">{vote.prettyvote}</div></div>)
    }
}


export default class VoteList extends Component {
    constructor(props) {
      super(props)
    }
  
    render() {
        const votes = this.props.votes;
        
        var voteListItems = []
          votes.forEach(v => {
           var voteItem = <Vote vote={v} key={v.divisionNumber}/>
           voteListItems.push(voteItem);
       })


      return (
          <div className="gv-votelist">{voteListItems}</div>
      )
    }
  }