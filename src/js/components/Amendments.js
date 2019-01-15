import React from 'react'
import Topline from './Topline'

const Amendments = ({ divInfos, manualData }) =>
  <div className='gv-amendments-wrapper'>
    {divInfos.map((divInfo, i) => <Topline key={'tpln-' + i} divInfo={divInfo} manualData={manualData.find(d => d.glossTitle == divInfo.glossTitle)} />)}
  </div>

export default Amendments
