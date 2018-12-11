import React, { Component } from 'react'
import Search from './Search.js'
import tracker from './../tracker'
import Drawer from './Drawer'
import { sortTable } from '../util'

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
          column: 'listAs',
          isDesc: true
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
        isDesc: !this.state.sortConditions.isDesc
      }

      this.setState({ sortConditions });
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
      const { expandedMps, isMobile, sortConditions: { column, isDesc } } = this.state
      const membersInfo = this.props.members
        .filter(m => m.allText.indexOf(this.state.filterText.toLowerCase()) > -1)
        .sort((a, b) => sortTable(a, b, column, isDesc))

      return(
        <div className="gv-outer-table">
        <Search filterText={this.state.filterText}   onFilterTextChange={this.handleFilterTextChange}/>
          {isMobile ? <div className="gv-expand-disclaimer">Tap header to sort, tap rows to expand</div> : null}
        <div className="int-table">
          <div className="int-row int-row--header">
            <div className="int-cell" onClick={() => this.handleSort('party')}>{isMobile ? 'PTY' : 'Party'}</div>
            <div className="int-cell" onClick={() => this.handleSort('listAs')}>Name</div>
            <div className="int-cell" onClick={() => this.handleSort('constituency')}>{isMobile ? 'Const.' : 'Constituency'}</div>
              <div className="int-cell int-cell--vote" onClick={() => this.handleSort('vote')}>Main vote</div>
              <div className="int-cell int-cell--reb" onClick={() => this.handleSort('isMainVoteRebel')}>{isMobile ? 'Rebel' : 'Rebel?'}</div>
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