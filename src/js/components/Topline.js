import React, { Component } from 'react'
import partyColours from '../utils'

const Topline = (divInfo) => {
  const votingMps = divInfo.ayesCount + divInfo.noesCount

  return (
    <div className="topline-wrapper">
      <div className='topline-ayes'>
      {
        divInfo.ayesByParty.map(
          d => <div style={{ color: partyColours[d.party], width: `${d.votes / votingMps * 100}%`}}>f</div>
        )
      }
      </div>
      <div className='topline-noes'>
        {
          divInfo.noesByParty.map(
            d => <div style={{ color: partyColours[d.party], width: `${d.votes / votingMps * 100}%` }}>f</div>
          )
        }
      </div>
    </div>
  )
}