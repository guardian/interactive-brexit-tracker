import React from 'react'
import { partyColours } from '../util'

const Topline = ({ divInfo, manualData }) => {
  const votingMps = divInfo.ayesCount + divInfo.noesCount
  const manualVotingMps = manualData.ayesCount && manualData.ayesCount + manualData.noesCount

  const sides = divInfo.ayesCount >= divInfo.noesCount ?
    [{ key: 'Ayes', val: divInfo.ayesByParty }, { key: 'Noes', val: divInfo.noesByParty }] :
    [{ key: 'Noes', val: divInfo.noesByParty }, {key: 'Ayes', val: divInfo.ayesByParty }]

  const manualSides = manualData.ayesCount > manualData.noesCount ?
    [{ key: 'Ayes', val: manualData.ayesCount }, { key: 'Noes', val: manualData.noesCount }] :
    [{ key: 'Noes', val: manualData.noesCount }, { key: 'Ayes', val: manualData.ayesCount }]

  return (
    <div className="gv-topline-wrapper">
      <div className='gv-topline-title'>{divInfo.glossTitle}</div>
      <div className='gv-topline-result'>
      {divInfo.hasData ?
        sides.map((side, i) =>
          <div key={'sw' + i} className='gv-bar-wrap'>
            <div className='gv-side-label'>{side.key === 'Ayes' ? 'For' : 'Against'}</div>
            <div key={'side' + i } className='gv-topline-bar'>
              {
                side.val.map((d,i) =>
                  <div key={'pty-' + i} style={{ background: partyColours[d.party], width: `${d.votes / votingMps * 100}%` }}>&nbsp;</div>
                )
              }
              <div className='gv-num-label'>{side.key === 'Ayes' ? divInfo.ayesCount - divInfo.ayeTellersCount : divInfo.noesCount - divInfo.noTellersCount}</div>
            </div>
          </div>
        ) : manualData.ayesCount ?
            manualSides.map((side, i) =>
              <div key={'msw' + i} className='gv-bar-wrap'>
                <div className='gv-side-label'>{side.key === 'Ayes' ? 'For' : 'Against'}</div>
                <div key={'mside' + i} className='gv-topline-bar'>
                  <div key={'mpty-' + i} style={{ background: '#777777', width: `${side.val / manualVotingMps * 100}%` }}>&nbsp;</div>
                  <div className='gv-num-label'>{side.key === 'Ayes' ? manualData.ayesCount : manualData.noesCount}</div>
                </div>
              </div>
            )
        : <div className='gv-placeholder-text'>{divInfo.didProceed ? 'To be confirmed' : 'Not moved to a vote'}</div>
      }
      </div>
      <p className='gv-topline-description'>{divInfo.glossText}</p>
    </div>
  )
}
export default Topline
