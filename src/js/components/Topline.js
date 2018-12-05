import React from 'react'
import { partyColours } from '../util'
import { truncate } from 'lodash'

const Topline = ({ divInfo }) => {
  
  const votingMps = divInfo.ayesCount + divInfo.noesCount
  const sides = divInfo.ayesCount >= divInfo.noesCount ?
    [{ key: 'Ayes', val: divInfo.ayesByParty }, { key: 'Noes', val: divInfo.noesByParty }] :
    [{ key: 'Noes', val: divInfo.noesByParty }, {key: 'Ayes', val: divInfo.ayesByParty }]

  return (
    <div className="gv-topline-wrapper">
      <div className='gv-topline-title'>{truncate(divInfo.title)}</div>
      { 
        sides.map((side, i) =>
          <div key={'sw' + i} className='gv-bar-wrap'>
            <div className='gv-side-label'>{side.key === 'Ayes' ? 'Yes' : 'No'}</div>
            <div key={'side' + i } className='gv-topline-bar'>
              {
                side.val.map((d,i) =>
                  <div key={'pty-' + i} style={{ background: partyColours[d.party], width: `${d.votes / votingMps * 100}%` }}>&nbsp;</div>
                )
              }
              <div className='gv-num-label'>{side.key === 'Ayes' ? divInfo.ayesCount : divInfo.noesCount}</div>
            </div>
          </div>
        )
      }
      <p className='gv-topline-description'>Will I be a description coming from a google doc? Will I exist at all? Only time will tell.</p>
    </div>
  )
}
export default Topline
