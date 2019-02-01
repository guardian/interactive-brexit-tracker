import React, { Component } from 'react'
import Search from './Search.js'
import tracker from './../tracker'
import { sortTable } from '../util'
import { timingSafeEqual } from 'crypto';

const constdata = (member) => {
  if (parseFloat(member.leaveVote) > .5) {
    return `Leave ${Math.round(100 * parseFloat(member.leaveVote))}%`
  } else if (parseFloat(member.leaveVote) < .5) {
    var remainvote = 1 - parseFloat(member.leaveVote);
    return `Remain ${Math.round(100 * remainvote)}%`
  } else return ('--')
}

const getMayCategory = (vote) => {
  if (vote.vote !== 'For' && vote.vote !== 'Against') {
    return "gv-did-not-vote"
  }
  else if (vote.vote == vote.ayeWithGvt) {
    return "gv-pro-may"
  } else { return "gv-anti-may" }
}

const parseMobileVote = (vote) => {
  if (!vote) {
    return 'TBC'
  }
  
  if (vote === 'Did not vote') {
    return '––'
  }
  
  if (vote === 'Against') {
    return 'Agst'
  }
  return vote
}

export default class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isMobile: false,
        isTablet: false,
        filterText: '',
        sortConditions: {
          column: 'listAs',
          isAsc: false
        },
        expandedMps: []
      }
      this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      this.handleSort = this.handleSort.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    handleSort(column) {
      const sortConditions = {
        column,
        isAsc: !this.state.sortConditions.isAsc
      }

      this.setState({ sortConditions });
      tracker('column_sort',column)
    }

    handleFilterTextChange(filterText) {
      this.setState({
        filterText: filterText
      });
    }

    componentDidMount() {
      this.setState({
        isMobile: (window && window.innerWidth < 450),
        isTablet: (window && window.innerWidth < 740)
      })
    }
  
    handleClick(mpId) {
      if (!this.props.hasAmendments) {
        return
      }
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
      const { expandedMps, isMobile, isTablet, sortConditions: { column, isAsc } } = this.state
      const membersInfo = this.props.members
        .filter(m => m.allText.indexOf(this.state.filterText.toLowerCase()) > -1)
        .sort((a, b) => sortTable(a, b, column, isAsc))

      const { hasAmendments } = this.props
      return(
        <div className="gv-outer-table">
        <h2>Brexit voting records</h2>
          <div class="int-sticky-key">
              <ol>
                <li>First government defeat on meaningful vote</li>
                <li>To reject Lords amendment to keep UK in the EEA</li>
                <li>Grieve amendment on 'meaningful vote'</li>
                <li>Government in contempt of parliament</li>
                <li>An amendable plan B</li>
                <li>Limiting no-deal through a finance bill amendment</li>
                <li>Plan B for Brexit within three days of defeat</li>
                <li>May's deal finally goes to a vote</li>
                <li>Extend Article 50 to the end of 2019</li>
                <li>Avoid backstop with 'alternative arrangements'</li>
              </ol>
              <div class="colours">
                <div class="with-gov"></div>
                <div class="against-gov"></div>
                <div class="abstain"></div>
              </div>
            </div>
          <Search filterText={this.state.filterText} onFilterTextChange={this.handleFilterTextChange}/>
          <div className="gv-expand-disclaimer">Tap header to sort{hasAmendments ? ', tap rows to expand' : ''}</div>
        <div className="int-table">
            <div className="int-row int-row--header">
              <div className="int-cell" onClick={() => this.handleSort('party')}>{isMobile ? 'Pty' : 'PARTY'}</div>
              <div className="int-cell" onClick={() => this.handleSort('listAs')}>NAME</div>
              <div className="int-cell" onClick={() => this.handleSort('constituency')}>{isMobile ? 'Seat' : 'CONSTITUENCY'}</div>
              { !isMobile && !isTablet && <div className="int-cell int-cell--vote" onClick={() => this.handleSort('vote')}>VOTING RECORD</div>}
              
          </div>
          {
           membersInfo.map((member, i) => {
              const mainVote = member.votes.find(d => d.isMainVote)
              const mainVoteString = mainVote ? isTablet ? parseMobileVote(mainVote.vote) : mainVote.vote === 'Did not vote' ? '--' : mainVote.vote : 'TBC'
              const shortParty = member.party
              const isOpen = expandedMps.indexOf(member.id) > -1
              return [
                <div key={`member-row-${i}`} className="int-row int-row--mp" style={{ cursor: hasAmendments ? 'pointer' : 'auto' }} onClick={() => this.handleClick(member.id)}>
                  <div className={`int-cell int-cell--party int-color--${shortParty}`}>{shortParty}</div>
                  <div className="int-cell int-cell--name">{member.name}</div>
                  <div className="int-cell int-cell--const">{member.constituency} ({constdata(member)})</div>
                  {<div style={{ display: isMobile || isTablet ? 'none' : 'table-cell' }} className={`int-cell int-cell--vote`}>
                    <div className="gv-vote-history">{member.votes.map((d, i) => <div className={`gv-vote-blob ${getMayCategory(d)}`}>{i + 1}</div>)}</div>
                  </div>}
                </div>,
                <div style={{ display: isMobile || isTablet ? 'table-row' : 'none' }} className="row-mobile">
                  <div className="gv-vote-history-wrapper">
                    <div className="mobile-history-title">Voting Record</div>
                    <div className="gv-vote-history">{member.votes.map((d, i) => <div className={`gv-vote-blob ${getMayCategory(d)}`}>{i + 1}</div>)}</div>
                  </div>
                </div> 
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