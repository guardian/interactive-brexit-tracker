import React from 'react'
import partyColours from '../util'

const Topline = divInfo => {
  
  const votingMps = divInfo.ayesCount + divInfo.noesCount
  const sides = divInfo.ayesCount >= divInfo.noesCount ?
    [{ key: 'Ayes', val: divInfo.ayesByParty }, { key: 'Noes', val: divInfo.noesByParty }] :
    [{ key: 'Noes', val: divInfo.noesByParty }, {key: 'Ayes', val: divInfo.ayesByParty }]
  console.log(sides)
  return (
    <div className="topline-wrapper">
      { 
        sides.map(side =>
          <div className='topline-bar'>
            {
              side.val.map(d =>
                <div style={{ color: partyColours[d.party], width: `${d.votes / votingMps * 100}%` }}>f</div>
              )
            }
          </div>)
      }
    </div>
  )
}
export default Topline
