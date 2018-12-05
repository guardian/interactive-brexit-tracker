import React from 'react'
import Topline from './Topline'

const Amendments = ({ divInfos }) => divInfos.map(divInfo => <Topline divInfo={divInfo} />)

export default Amendments
