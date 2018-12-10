import React, { Component } from 'react'
import Search from './Search.js'
import { prettyVoteName, shortNameFunc, sortByOccurrence } from '../util'
import tracker from './../tracker'


function checkForMainVoteRebels(member,vote) {
  var govVote = vote.ayeWithGvt ? 'AyeVote' : 'NoVote';

  if (vote.vote == 'A' || vote.vote == undefined || vote.vote == 'undefined') {return '-'}   
  else if (member.party == 'Conservative' && govVote != vote.vote) {
    return 'Yes'
  } else if (member.party != 'Conservative' && govVote == vote.vote) {
    return 'Yes'
  } else {
    return 'No'
  }
}

export default class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filterText: '',
        sortConditions: {
        },
        details : {
          closed : true,
          member: {},
          x: 0,
          y : 0
        },
        expandedMps: []
      }
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleMemberClick = this.handleMemberClick.bind(this);
      this.newHandleClick = this.newHandleClick.bind(this); 
    }


    handleMemberClick(e,member) {
          var newState = Object.assign({},this.state)
          newState.details = {
            closed: false,
            member : member,
            x: e.pageX,
            y: e.pageY
          }
          this.setState(newState)
        }
    

    handleClick(e,column) {
      var sos = tracker.registerEvent;
      var newState = Object.assign({},this.state);
      newState.sortConditions.column = column;
      if (newState.sortConditions.direction == 'up') {
        newState.sortConditions.direction = 'down'
      } else {newState.sortConditions.direction = 'up'}
      this.setState(newState);
      tracker('column_sort',column)

    }

    handleFilterTextChange(filterText) {
      this.setState({
        filterText: filterText
      });
    }
  
    newHandleClick(mpId) {
      const ids = [...this.state.expandedMps]
      const index = ids.indexOf(mpId)

      if (index > -1) {
        ids.splice(index, 1);
        this.setState({ expandedMps: ids });
      } else {
        this.setState({ expandedMps: [...this.state.expandedMps, mpId] })
      }
      tracker('expandMPdetails','expandMPdetails')
    }


    render() {
      
      const divisions = this.props.divisions;
      let membersInfo = divisions.membersInfo;
      membersInfo.map(m => {
        m.allText =  `${m.name} ${m.constituency}`;
        m.mainvote = m.votes.find(v => v.isMainVote == true)
        m.isMainVoteRebel = checkForMainVoteRebels(m,m.mainvote);
        return m;
    })  
    if (this.state.filterText.length > 0) {
      membersInfo = membersInfo.filter(m => m.allText.indexOf(this.state.filterText) > -1);
    }

    if (this.state.sortConditions.column == undefined) {
      var column = 'listAs'} else {
      var column = this.state.sortConditions.column;
      var direction = this.state.sortConditions.direction;
      membersInfo = membersInfo.sort((a,b) => {
          if (a[column] > b[column]) {return direction == 'up' ? 1 : -1}
          else if (a[column] < b[column]) { return direction == 'up' ? -1 : 1}
          else {return 0}
      })
  }

      const { expandedMps } = this.state

      return(
        <div className="gv-outer-table">
        <Search filterText={this.state.filterText}   onFilterTextChange={this.handleFilterTextChange}/>
        <div className="int-table">
          <div className="int-row int-row--header">
            <div className="int-cell" onClick={e => this.handleClick(e,'party')}>Party</div>
            <div className="int-cell" onClick={e => this.handleClick(e,'listAs')}>Name</div>
            <div className="int-cell" onClick={e => this.handleClick(e,'constituency')}>Constituency</div>
            <div className="int-cell int-cell--vote">Main vote</div>
            <div className="int-cell" onClick={e => this.handleClick(e,'isMainVoteRebel')}>Rebel?</div>
          </div>
          {
           membersInfo.map((member, i) => {
              const mainVote = member.votes.find(d => d.isMainVote)
              if (mainVote == undefined || mainVote == 'undefined') {
                var mainVoteString = 'TBC'
              } else { var mainVoteString = prettyVoteName(mainVote.vote)}
              const amendments = member.votes.filter(d => d.isMainVote === false)
              const shortParty = shortNameFunc(member.party)
              return [
                <div key={`member-row-${i}`} className="int-row int-row--mp" onClick={() => this.newHandleClick(member.id)}>
                  <div className={`int-cell int-color--${shortParty}`}>{shortParty}</div>
                  <div className="int-cell">{member.name}</div>
                  <div className="int-cell">{member.constituency}</div>
                  <div className={`int-cell int-cell--vote int-cell--vote-${mainVote.vote}`}>{`${mainVoteString}${mainVote.teller ? '*' : ''}`}</div>
                  <div className="int-cell">{member.isMainVoteRebel}</div>
                </div>,
                <div className="gv-drawer" key={`member-drawer-${i}`} style={{ display: expandedMps.indexOf(member.id) > -1 ? 'block' : 'none'}}>
                  {
                    amendments.map((d, i) =>
                    <div key={'drawer-vote-' + i}>
                        <div>{d.glossTitle} - {prettyVoteName(d.vote)}{d.teller ? '*' : ''}</div>
                      <div>{d.glossText}</div>
                    </div>
                  )
                }
                </div>
              ]
          }
          )
        }
        </div>
        </div>
      )
    };


  }