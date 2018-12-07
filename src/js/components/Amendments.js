import React from 'react'
import Topline from './Topline'

const Amendments = ({ divInfos }) =>
  <div className='gv-amendments-wrapper'>
    {divInfos.map((divInfo, i) => <Topline key={'tpln-' + i} divInfo={divInfo} />)}
  </div>

export default Amendments
