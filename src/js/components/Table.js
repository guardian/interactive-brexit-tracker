import React, { Component } from 'react'
import Search from './Search.js'
import tracker from './../tracker'
import Drawer from './Drawer'


const checkForMainVoteRebels = (member,vote) => {
  var govVote = vote.ayeWithGvt ? 'For' : 'Against';

  if (vote.vote == 'Did not vote' || vote.vote == undefined || vote.vote == 'undefined') { return '––'}   
  else if (member.party == 'Con' && govVote != vote.vote) {
    return 'Yes'
  } else if (member.party != 'Con' && govVote == vote.vote) {
    return 'Yes'
  } else {
    return 'No'
  }
}

const parseMobileVote = (vote) => {
  if (!vote) {
    return 'TBC'
  }
  
  if (vote === 'Did not vote') {
    return '––'
  }
  
  if (vote === 'Against') {
    return 'Agst.'
  }
  return vote
}

export default class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isMobile: window.innerWidth < 450,
        filterText: '',
        sortConditions: {
        },
        expandedMps: []
      }
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleSort = this.handleSort.bind(this);
      this.handleClick = this.handleClick.bind(this);

    }

    handleSort(e,column) {
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
  
    handleClick(mpId) {
      const ids = [...this.state.expandedMps]
      const index = ids.indexOf(mpId)
      var sos = tracker.registerEvent;
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
      membersInfo = membersInfo.filter(m => m.allText.toLowerCase().indexOf(this.state.filterText.toLowerCase()) > -1);
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

      const { expandedMps, isMobile } = this.state

      return(
        <div className="gv-outer-table">
        <Search filterText={this.state.filterText}   onFilterTextChange={this.handleFilterTextChange}/>
          {isMobile ? <div className="gv-expand-disclaimer">Tap header to sort, tap rows to expand</div> : null}
        <div className="int-table">
          <div className="int-row int-row--header">
            <div className="int-cell" onClick={e => this.handleSort(e,'party')}>{isMobile ? 'PTY' : 'Party'}</div>
            <div className="int-cell" onClick={e => this.handleSort(e,'listAs')}>Name</div>
            <div className="int-cell" onClick={e => this.handleSort(e,'constituency')}>{isMobile ? 'Const.' : 'Constituency'}</div>
            <div className="int-cell int-cell--vote">Main vote</div>
              <div className="int-cell int-cell--reb" onClick={e => this.handleSort(e, 'isMainVoteRebel')}>{isMobile ? 'Rebel' : 'Rebel?'}</div>
          </div>
          {
           membersInfo.map((member, i) => {
              const mainVote = member.votes.find(d => d.isMainVote)
                const mainVoteString = isMobile ? parseMobileVote(mainVote.vote) : mainVote ? mainVote.vote === 'Did not vote' ? '––' : mainVote.vote : 'TBC'
              const shortParty = member.party
              const isOpen = expandedMps.indexOf(member.id) > -1
              return [
                <div key={`member-row-${i}`} className="int-row int-row--mp" onClick={() => this.handleClick(member.id)}>
                  <div className={`int-cell int-cell--party int-color--${shortParty}`}>{shortParty}</div>
                  <div className="int-cell int-cell--name">{member.name} 
                  {!isMobile ? isOpen ? <img src='<%= path %>/assets/uparrow.png' className="gv-downtrg" /> : <img src='<%= path %>/assets/downarrow.png' className="gv-downtrg" /> : null}
                  </div>
                  <div className="int-cell int-cell--const">{member.constituency}</div>
                  <div className={`int-cell int-cell--vote`}>{`${mainVoteString}${mainVote.teller ? '*' : ''}`}</div>
                  <div className="int-cell int-cell--reb">{member.isMainVoteRebel}</div>
                </div>,
                <Drawer key={'drawer-' + i} isOpen={isOpen} votes={member.votes} />
              ]
          }
          )
        }
        </div>
        <div className="gv-teller-disclaimer">* Teller for the division. Not counted in the totals of those voting for or against the motion</div>
        </div>
      )
    };


  }