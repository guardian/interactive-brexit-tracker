import React from 'react'
import { partyColours } from '../util'

const Topline = ({ divInfo }) => {
  const votingMps = divInfo.ayesCount + divInfo.noesCount
  const sides = divInfo.ayesCount >= divInfo.noesCount ?
    [{ key: 'Ayes', val: divInfo.ayesByParty }, { key: 'Noes', val: divInfo.noesByParty }] :
    [{ key: 'Noes', val: divInfo.noesByParty }, {key: 'Ayes', val: divInfo.ayesByParty }]

  return (
    <div className="gv-topline-wrapper">
      <div className='gv-topline-title'>{divInfo.glossTitle}</div>
      <div className='gv-topline-result'>
      {divInfo.hasData ?
        sides.map((side, i) =>
          <div key={'sw' + i} className='gv-bar-wrap'>
            <div className='gv-side-label'>{side.key === 'Ayes' ? 'Yes' : 'No'}</div>
            <div key={'side' + i } className='gv-topline-bar'>
              {
                side.val.map((d,i) =>
                  <div key={'pty-' + i} style={{ background: partyColours[d.party], width: `${d.votes / votingMps * 100}%` }}>&nbsp;</div>
                )
              }
              <div className='gv-num-label'>{side.key === 'Ayes' ? divInfo.ayesCount - divInfo.ayeTellersCount : divInfo.noesCount - divInfo.noTellersCount}</div>
            </div>
          </div>
        ) : <div className='gv-placeholder-text'>Not voted yet</div>
      }
      </div>
      <p className='gv-topline-description'>{divInfo.glossText}</p>
    </div>
  )
}
export default Topline
