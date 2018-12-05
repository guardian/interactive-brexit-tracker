import React from 'react'
import Topline from './Topline'

const Amendments = ({ divisions }) => divisions.map(divInfo => <Topline divInfo={divInfo} />)

export default Amendments
